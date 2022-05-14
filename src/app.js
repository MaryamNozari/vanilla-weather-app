function formatDate() {
  let now = new Date();
  let currentDay = now.getDay();
  let currentMonth = now.getMonth();
  let currentDate = now.getDate();
  let currentHour = now.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinute = now.getMinutes();
  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }

  let day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let month = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  //let li = document.querySelector("#date");
  return `${day[currentDay]} , ${month[currentMonth]} ${currentDate} ${currentHour}:${currentMinute}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}
function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  //let days = ["Tue", "Wed", "Thu"];
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
           <div class="col-2">
               <ul>
                  <li class="forecast_day">
                      ${formatDay(forecastDay.dt)}
                  </li>
                <li class="forecast_image">
                      <img class="wob_tci" alt="Clear with periodic clouds" src="http://openweathermap.org/img/wn/${
                        forecastDay.weather[0].icon
                      }@2x.png" id="wob_tci" data-atf="1" data-frt="0" />
                </li>
                <li class="'forecast_temprature">
                    <span class="max_temp">${Math.round(
                      forecastDay.temp.max
                    )}&#176 </span> 
                    <span class="min_temp">${Math.round(
                      forecastDay.temp.min
                    )}&#176</span>
                </li>  
               </ul>
           
                
            </div>
        `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
function showTemp(response) {
  document.querySelector("h2").innerHTML = response.data.name;
  document.querySelector("#temp-number").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector(
    "#humidity"
  ).innerHTML = `humidity: ${response.data.main.humidity}%`;
  document.querySelector(
    "#wind-speed"
  ).innerHTML = `wind: ${response.data.wind.speed}mph`;
  let li = document.querySelector("#date");
  li.innerHTML = formatDate(response.data.dt * 1000);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  iconElement.setAttribute("alt", response.data.weather[0].description);

  celsiusTemprature = response.data.main.temp;

  getForecast(response.data.coord);
}
// function showCity(event) {
//   event.preventDefault();
//   let inputCity = document.querySelector("#input-city");
//   document.querySelector("h2").innerHTML = inputCity.value;

//   let apiKey = "a19149d935a95bd92d19c439727ab1de";
//   let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity.value}&appid=${apiKey}&units=metric`;
//   axios.get(apiUrl).then(showTemp);
// }
function searchCity(city) {
  //document.querySelector("h2").innerHTML = city;
  let apiKey = "a19149d935a95bd92d19c439727ab1de";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemp);
}

function handelSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#input-city").value;
  //document.querySelector("h2").innerHTML = city;
  searchCity(city);
}
// let form = document.querySelector(".form-inline");
// form.addEventListener("submit", showCity);
let form = document.querySelector(".form-inline");
form.addEventListener("submit", handelSubmit);
//challenge #3
function ChangeUnitF(event) {
  event.preventDefault();
  let temp = document.querySelector("#temp-number");
  let temprature = temp.innerHTML;
  temprature = Number(temprature);
  temp.innerHTML = Math.round((celsiusTemprature * 9) / 5 + 32);
  celsiusTemp.classList.remove("active");
  farenhietTemp.classList.add("active");
}

let farenhietTemp = document.querySelector("#farenhiet");
farenhietTemp.addEventListener("click", ChangeUnitF);

function ChangeUnitC(event) {
  event.preventDefault();
  let temp = document.querySelector("#temp-number");
  temp.innerHTML = Math.round(celsiusTemprature);
  farenhietTemp.classList.remove("active");
  celsiusTemp.classList.add("active");
}

let celsiusTemp = document.querySelector("#celsius");
celsiusTemp.addEventListener("click", ChangeUnitC);

let celsiusTemprature = null;

//let city = document.querySelector("#city");
//let city = inputCity.value;
function showPosition(position) {
  // let lat = position.coords.latitude;
  // let long = position.coords.longitude;
  let apiKey = "a19149d935a95bd92d19c439727ab1de";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemp);
}

function showLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", showLocation);

searchCity("New York");
displayForecast();
