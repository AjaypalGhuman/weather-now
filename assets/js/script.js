// API key
const APIKey = "af0b4990f1ac7f80e651af5c489f6881";

// Variables
var locationEl = document.getElementById("lookup-city");
var searchLocationEl = document.querySelector("#Search");
var nameEl = document.getElementById("city-name");
var currentWeatherEl = document.getElementById("current-weather");
var weatherPicEl = document.getElementById("weather-picture");
var temperatureEl = document.getElementById("temperature");
var windEl = document.getElementById("wind");
var humidityEl = document.getElementById("humidity");
var uvEl = document.getElementById("UV");
var recentSearchEl = document.getElementById("search-list");
var forecastEl = document.getElementById("forecast-header");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
var clearEl = document.querySelector("#delete");


// get request from API to retrieve weather information
function getWeather(locationName) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + locationName + "&appid=" + APIKey;

    fetch(apiUrl)
    .then(function(response) {

        currentWeatherEl.classList.remove("d-none");

        const currentDate = new Date(data.dt * 1000);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        nameEl.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ") ";
        let weatherPic = data.weather[0].icon;
        weatherPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
        weatherPicEl.setAttribute("alt", data.weather[0].description);

        temperatureEl.innerHTML = "Temperature: " + k2f(data.main.temp) + " &#176F";

        windEl.innerHTML = "Wind Speed: " + data.wind.speed + " MPH";

        humidityEl.innerHTML = "Humidity: " + data.main.humidity + " %";

        // retrieves the UV index data
        let latitude = data.coord.lat;
        let longitude = data.coord.lon;
        let UVapiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial"+ "&daily&appid=" + APIKey;
        
        fetch(UVapiURL)
            .then(function(response) {

                let uv = document.createElement("span");
                
                if (data[0].value < 4 ) {
                    uv.setAttribute("class", "badge badge-pill badge-primary");
                }
                else if (data[0].value < 8) {
                    uv.setAttribute("class", "badge badge-pill badge-warning");
                }
                else {
                    uv.setAttribute("class", "badge badge-pill badge-danger");
                }
                console.log(data[0].value)
                uv.innerHTML = data[0].value;
                uvEl.innerHTML = "UV: ";
                uvEl.append(uv);
            });

    })
}