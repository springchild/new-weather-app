let apiKey = "9b6ca84186ab2a21277c82510180b38a";
let endpoint = "https://api.openweathermap.org/data/2.5/weather?";
let city = "Boston";
let units = "imperial";
let apiUrl = `${endpoint}q=${city}&units=${units}&appid=${apiKey}`;

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
}
axios.get(apiUrl).then(showData);
