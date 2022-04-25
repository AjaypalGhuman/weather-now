// API key
const APIKey = "af0b4990f1ac7f80e651af5c489f6881";

// Variables
var locationEl = document.getElementById("lookup-city");
var searchLocationEl = document.querySelector("#Search");
var nameEl = document.getElementById("city-name");
var currentWeatherEl = document.getElementById("current-weather");
var weatherPicEl = document.getElementById("weather-picture");
var tempEl = document.getElementById("temperature");
var windEl = document.getElementById("wind");
var humidityEl = document.getElementById("humidity");
var uvEl = document.getElementById("UV");
var recentSearchEl = document.getElementById("search-list");
var forecastEl = document.getElementById("forecast-header");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
var clearEl = document.querySelector("#delete");


