var APIKey = "5a6cef4d1204ccc7f8ea98b77c56795b";

var inputEl = document.getElementById("city-input");
var searchEl = document.getElementById("search-button");
var clearEl = document.getElementById("clear-history");
var nameEl = document.getElementById("city-name");
var currentPicEl = document.getElementById("current-pic");
var temperatureEl = document.getElementById("temperature");
var humidityEl = document.getElementById("humidity");4
var windEl = document.getElementById("wind-speed");
var currentUVEl = document.getElementById("UV-index");
var historyEl = document.getElementById("history");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];


    function fetchWeather(location) {

        let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`;
        axios.get(apiURL)
        .then(function(response){
            console.log(response);

            var currentDate = new Date(response.data.dt*1000);
            console.log(currentDate);

            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            nameEl.innerHTML = response.data.name + " " + month + "/" + day + "/" + year + " ";
            let weatherPic = response.data.weather[0].icon;
            currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentPicEl.setAttribute("alt",response.data.weather[0].description);
            temperatureEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
            humidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            windEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " mph";

        let latitude = response.data.coord.lat;
        let longitude = response.data.coord.lon;
        let UvApiURL = `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKey}&cnt=1`;

        axios.get(UvApiURL)
        .then(function(response){

            let UVIndex = document.createElement("span");
            UVIndex.setAttribute("class","badge badge-danger");
            UVIndex.innerHTML = response.data[0].value;
            currentUVEl.innerHTML = "UV Index: ";
            currentUVEl.append(UVIndex);
        });

        var cityID = response.data.id;
        let forecastApiURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${APIKey}`;
        axios.get(forecastApiURL)
        .then(function(response){

            console.log(response);
            const forecastEl = document.querySelectorAll(".forecast");
            for (i=0; i < forecastEl.length; i++) {
                forecastEl[i].innerHTML = "";
                var forecastIndex = i * 8 + 4;
                var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                var forecastDay = forecastDate.getDate();
                var forecastMonth = forecastDate.getMonth() + 1;
                var forecastYear = forecastDate.getFullYear();
                var forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
                forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastEl[i].append(forecastDateEl);
                var forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastWeatherEl.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
                forecastEl[i].append(forecastWeatherEl);
                var forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                forecastEl[i].append(forecastTempEl);
                var forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                forecastEl[i].append(forecastHumidityEl);
                }
            })
        });  
    }

    searchEl.addEventListener("click",function() {
        
        const searchTerm = inputEl.value;
        fetchWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search",JSON.stringify(searchHistory));
        getSearchHistory();
    })

    clearEl.addEventListener("click",function() {

        searchHistory = [];
        getSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) *1.8 +32);
    }

    function getSearchHistory() {
        historyEl.innerHTML = "";
        for (let i=0; i<searchHistory.length; i++) {
            const historyItem = document.createElement("input");
     
            historyItem.setAttribute("type","text");
            historyItem.setAttribute("readonly",true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click",function() {

                fetchWeather(historyItem.value);
            })

            historyEl.append(historyItem);
        }
    }

    getSearchHistory();
    if (searchHistory.length > 0) {
        fetchWeather(searchHistory[searchHistory.length - 1]);
    }
