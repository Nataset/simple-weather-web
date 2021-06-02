const express = require("express");
const Datastore = require("nedb");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("start server at " + port);
});
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore("database.db");
database.loadDatabase();

app.post("/api", (req, res) => {
    console.log("post request at /api");
    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    res.json(data);
});

app.get("/api", (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});

app.get("/weather/:lat/:long", async (req, res) => {
    const lat = req.params.lat;
    const long = req.params.long;
    console.log(`get request at /weather/${lat}/${long}`);
    const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=a260c361e01c99530f7acc9eec48ccc4`
    );
    const data = await response.json();
    res.json(data);
});

app.get("/test", (req, res) => {
    console.log("test");
    res.send("<h1>Fuck you</h1>");
});

app.get("/all", (req, res) => {
    res.sendFile(__dirname + "/public/html/all.html");
});
