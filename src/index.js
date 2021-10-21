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
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()]; //picks an item in the array corresponding with number from API
  return `${day} ${hours}:${minutes} ${am_pm}`;
}

function showData(response) {
  let temp = document.querySelector("#temp-digits");
  temp.innerHTML = Math.round(response.data.main.temp);
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
  country = document.querySelector("#country");
  country.innerHTML = response.data.sys.country;
  let description = document.querySelector("#weather-desc");
  description.innerHTML = response.data.weather[0].main;
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
    `http://openweathermap.org/img/wn/${iconCode}@2x.png`
  ); // change original icon src to one provided by API
  mainIcon.setAttribute("alt", response.data.weather[0].main);
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

function handleSearch(event) {
  event.preventDefault();
  let userInput = document.querySelector("#input-bar").value;
  searchCity(userInput);
}
let form = document.querySelector("form");
form.addEventListener("submit", handleSearch);

searchCity("Boston");
