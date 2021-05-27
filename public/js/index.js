let lat;
let long;
let weatherDescript;
let temp;

const getWeather = async (lat, long) => {
    const response = await fetch(`/weather/${lat}/${long}`);
    const data = await response.json();
    const { weather, main } = data;
    const weatherDescript = weather[0].description;
    const temp = main.temp;

    setElement(weatherDescript, temp);

    return { lat, long, weatherDescript, temp };
};

const postWeather = async (data) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const response = await fetch("/api", options);
    const json = await response.json();
    console.log(json);
};

const setElement = (weather, temp) => {
    const text = document.createElement("h1");
    text.innerText = `Weather: ${weather}`;
    document.querySelector("#content").appendChild(text);

    const textTemp = document.createElement("h1");
    textTemp.innerHTML = `Temperature: ${(temp - 272.15).toFixed(2)}&deg;C`;
    document.querySelector("#content").appendChild(textTemp);
};

const resizeWindow = () => {
    document.querySelector("#content").style.height = window.innerHeight - 2 + "px";
};

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude.toFixed(4);
        long = position.coords.longitude.toFixed(4);
        console.log("lat:", lat, "long:", long);
        getWeather(lat, long).then((data) => postWeather(data));
        document.querySelector("#sentPost").onclick = () => {
            postWeather();
        };
    });
} else {
    alet("Please allow us to know your location");
}

resizeWindow();
window.onresize = resizeWindow;
