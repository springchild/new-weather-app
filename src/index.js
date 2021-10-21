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

function showData(response) {
  let temp = document.querySelector("#temp-digits");
  fahrenheitTemp = response.data.main.temp; // <-- Global var. Storing API temp response inside
  temp.innerHTML = Math.round(response.data.main.temp);
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
  country = document.querySelector("#country");
  country.innerHTML = response.data.sys.country;
  let description = document.querySelector("#weather-desc");
  description.innerHTML = response.data.weather[0].description;
  let feelsLike = document.querySelector("#feels-like");
  feelsLike.innerHTML = Math.round(response.data.main.feels_like);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);
  let dateTime = document.querySelector("#date-time");
  dateTime.innerHTML = formatDate(response.data.dt * 1000); //convert dt from seconds to miliseconds
  let iconCode = response.data.weather[0].icon;
  let mainIcon = document.querySelector("#main-icon");
  mainIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  ); // change original icon src to one provided by API
  mainIcon.setAttribute("alt", response.data.weather[0].main);
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active"); //<-- to display F as active on load for a new city search, in case C was previously clicked.
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

searchCity("Boston");
