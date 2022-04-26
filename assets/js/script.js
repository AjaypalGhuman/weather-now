// API key
var APIKey = "5a6cef4d1204ccc7f8ea98b77c56795b";

// Variables declared onto the global scope
var locationEl = document.getElementById("location-input");

var findLocationEl = document.getElementById("searchBtn");

var deleteEl = document.getElementById("delete-history");

var locationNameEl = document.getElementById("location-name");

var weatherIconEl = document.getElementById("weather-pic");

var temperatureEl = document.getElementById("temperature");

var humidityEl = document.getElementById("humidity");

var windEl = document.getElementById("wind");

var uvEl = document.getElementById("UV");

var historyDataEl = document.getElementById("historyData");

var History = JSON.parse(localStorage.getItem("search")) || [];

// get request from API to retrieve weather information
function fetchWeather(location) {
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`;

  axios.get(apiURL).then(function (response) {
    console.log(response);
    // retrieve date data
    var currentDate = new Date(response.data.dt * 1000);
    console.log(currentDate);

    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    locationNameEl.innerHTML = `${response.data.name} ${month}/${day}/${year} `;
    // displays weather image icon
    let weatherPic = response.data.weather[0].icon;
    weatherIconEl.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${weatherPic}@2x.png`
    );
    weatherIconEl.setAttribute("alt", response.data.weather[0].description);
    // displays temperature, wind speed, and humidity of location on the card body
    temperatureEl.innerHTML = `Temperature: ${k2f(
      response.data.main.temp
    )} &#176F`;

    windEl.innerHTML = `Wind: ${response.data.wind.speed} mph`;

    humidityEl.innerHTML = `Humidity: ${response.data.main.humidity}%`;
// helps retrieve and display the UV index data
    let latitude = response.data.coord.lat;
    let longitude = response.data.coord.lon;
    let UvApiURL = `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKey}&cnt=1`;
// creates the color that will show whether a UV index is favorable, moderate, or severe
    axios.get(UvApiURL).then(function (response) {
      let uvIndex = document.createElement("span");
      if (response.data[0].value < 4) {
        uvIndex.setAttribute("class", "badge badge-pill badge-primary");
      } else if (response.data[0].value < 8) {
        uvIndex.setAttribute("class", "badge badge-pill badge-warning");
      } else {
        uvIndex.setAttribute("class", "badge badge-pill badge-danger");
      }
      console.log(response.data[0].value);
      uvIndex.innerHTML = response.data[0].value;
      uvEl.innerHTML = "Current UV Index: ";
      uvEl.append(uvIndex);
    });
// Displays the 5-day forecast using the API call
    var cityID = response.data.id;
    let forecastApiURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${APIKey}`;
    axios.get(forecastApiURL).then(function (response) {
      console.log(response);

      var forecastEl = document.querySelectorAll(".forecast");

      for (i = 0; i < forecastEl.length; i++) {
        forecastEl[i].innerHTML = "";
        var forecastIndex = i * 8 + 4;
        var forecastDate = new Date(
          response.data.list[forecastIndex].dt * 1000
        );
        var forecastDay = forecastDate.getDate();
        var forecastMonth = forecastDate.getMonth() + 1;
        var forecastYear = forecastDate.getFullYear();
        var forecastDateEl = document.createElement("p");

        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
        forecastDateEl.innerHTML =
          forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecastEl[i].append(forecastDateEl);
// adds and image of the weather for each consecutive day in the forecast
        var forecastWeatherEl = document.createElement("img");
        forecastWeatherEl.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${response.data.list[forecastIndex].weather[0].icon}@2x.png`
        );
        forecastWeatherEl.setAttribute(
          "alt",
          response.data.list[forecastIndex].weather[0].description
        );
        forecastEl[i].append(forecastWeatherEl);
// displays the data of each weather attribute under each consecutive day
        var TemperatureEl = document.createElement("p");
        TemperatureEl.innerHTML =
          `Temp: ${k2f(response.data.list[forecastIndex].main.temp)} &#176F`;
        forecastEl[i].append(TemperatureEl);

        var WindEl = document.createElement("p");
        WindEl.innerHTML =
          `Wind: ${response.data.list[forecastIndex].wind.speed} mph`;
        forecastEl[i].append(WindEl);

        var HumidityEl = document.createElement("p");
        HumidityEl.innerHTML =
          `Humidity: ${response.data.list[forecastIndex].main.humidity}%`;
        forecastEl[i].append(HumidityEl);
      }
    });
  });
}

// handling the submit and delete functionality below

findLocationEl.addEventListener("click", function () {
  
 var searchItem = locationEl.value;
  fetchWeather(searchItem);
  History.push(searchItem);

  localStorage.setItem("search", JSON.stringify(History));

  fetchHistory();
});

deleteEl.addEventListener("click", function () {

  History = [];

  fetchHistory();
});

function k2f(K) {
  return Math.floor((K - 273.15) * 1.8 + 32);
}

// help display search history
function fetchHistory() {

  historyDataEl.innerHTML = "";
  for (let i = 0; i < History.length; i++) {
    const historyItem = document.createElement("input");

    historyItem.setAttribute("type", "text");
    historyItem.setAttribute("readonly", true);
    historyItem.setAttribute("class", "form-control d-block bg-white");
    historyItem.setAttribute("value", History[i]);
    historyItem.addEventListener("click", function () {
      fetchWeather(historyItem.value);
    });

    historyDataEl.append(historyItem);
  }
}

fetchHistory();

if (History.length > 0) {
  fetchWeather(History[History.length - 1]);
}
