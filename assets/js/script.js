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
var recentSearchEl = document.getElementsByClassName("list-group");
var upcomingForecastEl = document.getElementById("forecast-header");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
var deleteEl = document.querySelector("#delete");
console.log(recentSearchEl);


// get request from API to retrieve weather information
function getWeather(locationName) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + locationName + "&appid=" + APIKey;

    fetch(apiUrl)
    .then(function(response) {

        currentWeatherEl.classList.remove("d-none");

        var currentDate = new Date(data.dt * 1000);
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();

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

                
                var cityId = data.id;
                var forecastApiURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&appid=" + APIKey;
                fetch(forecastApiURL)
                    .then(function (response) {
                        upcomingForecastEl.classList.remove("d-none");
                        
                        
                        var forecastEl = document.querySelectorAll(".forecast");

                        for (i = 0; i < forecastEl.length; i++) {

                            forecastEl[i].innerHTML = "";
                            var forecastDt = i * 8 + 4;
                            var forecastDate = new Date(data.list[forecastDt].dt * 1000);
                            var forecastDay = forecastDate.getDate();
                            var forecastMonth = forecastDate.getMonth() + 1;
                            var forecastYear = forecastDate.getFullYear();
                            var forecastTitle = document.createElement("p");

                            forecastTitle.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastTitle.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEl[i].append(forecastTitle);

                            
                            var WeatherEl = document.createElement("img");

                            WeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastDt].weather[0].icon + "@2x.png");
                            WeatherEl.setAttribute("alt", data.list[forecastDt].weather[0].description);
                            forecastEl[i].append(WeatherEl);

                            var TempEl = document.createElement("p");
                            TempEl.innerHTML = "Temp: " + k2f(data.list[forecastDt].main.temp) + " &#176F";
                            forecastEl[i].append(TempEl);

                            var HumidityEl = document.createElement("p");
                            HumidityEl.innerHTML = "Humidity: " + data.list[forecastDt].main.humidity + "%";
                            forecastEl[i].append(HumidityEl);

                            var WindEl = document.createElement("p");
                            WindEl.innerHTML = "Wind-Speed: " + data.list[forecastDt].main.wind.speed + "mph";
                            forecastEl[i].append(WindEl);
                        }
                    })
            });
    }

   
   searchLocationEl.addEventListener("submit", function () {
    var searchTerm = locationEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
})

// Clear History button
deleteEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
})

function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

function renderSearchHistory() {
    recentSearchEl.innerHTML = "";
    for (let i = 0; i < history.length; i++) {
        var historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click", function () {
            getWeather(historyItem.value);
        })
        recentSearchEl.append(historyItem);
    }
}

renderSearchHistory();
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
}

    