const express = require("express");
const fetch = require("node-fetch");
const Datastore = require("nedb");
const { MongoClient, connect } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("start server at " + port);
});
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const uri = "mongodb+srv://TroNine:0207185859@gettingstarted.9uzod.mongodb.net/myFirstDatabase";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// ### delete all data in locations collection
// client
//     .connect()
//     .then((client) => client.db("weather_app").collection("locations").deleteMany())
//     .then((result) => result.deletedCount)
//     .then((count) => console.log(count));

async function write(input) {
    try {
        const database = client.db("weather_app");
        const locations = database.collection("locations");
        const result = await locations.insertOne(input);
        return result ? "write data success" : "write data fall";
    } catch (error) {
        console.error(error);
    }
}

const read = async (callback) => {
    const database = client.db("weather_app");
    const locations = database.collection("locations");
    callback(await locations.find({}).toArray());
    // await locations.find().forEach((location) => callback(location));

    // ### read function only use then
    // client
    //     .connect()
    //     .then((res) => res.db("weather_app"))
    //     .then((database) => database.collection("locations"))
    //     .then((locations) => locations.find().forEach(callback))
    //     .finally(client.close());
};

// const database = new Datastore("database.db");
// database.loadDatabase();

client
    .connect()
    .then(console.log("connected successfully"))
    .catch((error) => {
        consoel.log("unable to connect");
        console.error(error);
    });

app.post("/api", async (req, res) => {
    console.log("post request at /api");
    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    await write(data).then((result) => console.log(result));
    res.json(data);
});

app.get("/api", async (request, response) => {
    console.log("get request at /api");
    await read((data) => response.json(data));
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
