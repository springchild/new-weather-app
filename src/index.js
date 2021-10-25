function formatDate(timestamp) {
  //will calculate date based on miliseconds passed since 1970??
  let date = new Date(timestamp);
  let hours = date.getHours();
  let am_pm = "AM";
  if (hours > 12) {
    hours = hours - 12;
    am_pm = "PM";
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()]; //picks an item in the array corresponding with number from API
  return `${day} ${hours}:${minutes} ${am_pm}`;
}
//to get lat and long for 7 day forecast:
function getForecast(coords) {
  let apiKey = "9b6ca84186ab2a21277c82510180b38a";
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}
//transform timestamps into days of week:
function formatForecastDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];

  return day;
}
function showData(response) {
  let temp = document.querySelector("#temp-digits");
  let city = document.querySelector("#city");
  let description = document.querySelector("#weather-desc");
  let feelsLike = document.querySelector("#feels-like");
  let tempHi = document.querySelector("#temp-hi");
  let tempLo = document.querySelector("#temp-lo");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let dateTime = document.querySelector("#date-time");
  let mainIcon = document.querySelector("#main-icon");
  let iconCode = response.data.weather[0].icon;
  fahrenheitTemp = response.data.main.temp; // <-- Global var. Storing API temp response inside
  temp.innerHTML = Math.round(response.data.main.temp);
  city.innerHTML = response.data.name;
  country = document.querySelector("#country");
  country.innerHTML = response.data.sys.country;
  description.innerHTML = response.data.weather[0].description;
  feelsLike.innerHTML = Math.round(response.data.main.feels_like);
  tempHi.innerHTML = Math.round(response.data.main.temp_max);
  tempLo.innerHTML = Math.round(response.data.main.temp_min);
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = Math.round(response.data.wind.speed);
  dateTime.innerHTML = formatDate(response.data.dt * 1000); //convert dt from seconds to miliseconds
  mainIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  ); // change original icon src to one provided by API
  mainIcon.setAttribute("alt", response.data.weather[0].main);
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active"); //<-- to display F as active on load for a new city search, in case C was previously clicked.
  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "9b6ca84186ab2a21277c82510180b38a";
  let endpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "imperial";
  let apiUrl = `${endpoint}q=${city}&units=${units}&appid=${apiKey}`;
  if (city) {
    axios.get(apiUrl).then(showData);
  } else {
    alert("Please enter a city");
  }
}
//programming search engine
function handleSearch(event) {
  event.preventDefault();
  let userInput = document.querySelector("#input-bar").value;
  searchCity(userInput);
}
let form = document.querySelector("form");
form.addEventListener("submit", handleSearch);

//programming current location button
function fetchLocation(position) {
  let apiKey = "9b6ca84186ab2a21277c82510180b38a";
  let endpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "imperial";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `${endpoint}lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showData);
}
let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(fetchLocation);
});

//temperature conversion
//create global variable for F temp so it's accessible from any function:
let fahrenheitTemp = null; //<-- will be used to convert to and from Celsius
//conveting to Celsius
function convertToC(event) {
  event.preventDefault();
  let tempDigits = document.querySelector("#temp-digits");
  celsiusTemp = ((fahrenheitTemp - 32) * 5) / 9;
  tempDigits.innerHTML = Math.round(celsiusTemp);
  fahrenheitLink.classList.remove("active"); //<-- remove .active from temp-f link once clicked on temp-c
  celsiusLink.classList.add("active"); //<-- add .active to temp-c link once clicked on temp-c
}
let celsiusLink = document.querySelector("#temp-c");
celsiusLink.addEventListener("click", convertToC);

//converting back to Fahrenheit
function convertToF(event) {
  event.preventDefault();
  let tempDigits = document.querySelector("#temp-digits");
  tempDigits.innerHTML = Math.round(fahrenheitTemp);
  fahrenheitLink.classList.add("active"); //<-- add .active to temp-f when clicked on temp-f
  celsiusLink.classList.remove("active"); //<-- remove .active from temp-c when clicked on temp-f
}
let fahrenheitLink = document.querySelector("#temp-f");
fahrenheitLink.addEventListener("click", convertToF);

//displaying forecast:
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  //inject a forecast html block with structure:
  let forecastHTML = ""; //variable to store HTML to use in a loop. To be with real data.
  //create var to house a response array:
  let forecastArray = response.data.daily;
  //to loop through each day in the array:
  forecastArray.forEach(function (forecastDay, index) {
    //to limit how many days to display in forecast:
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `<div class="forecast-element row">
            <span class="week-day col">${formatForecastDate(
              forecastDay.dt
            )}</span>
            <span class="week-temp col">
              <span class="temp-hi">${Math.round(
                forecastDay.temp.max
              )}&degF</span> 
              <span class="temp-lo">${Math.round(
                forecastDay.temp.min
              )}&degF</span>
            </span>
            <img
              class="mini-icon col"
              src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              title="${forecastDay.weather[0].main}"
            />
          </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}
searchCity("Boston");
