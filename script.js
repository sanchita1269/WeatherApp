const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e => {
  // if user pressed enter btn 
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});


locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) { // if browser support geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
  }
});

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=2fb02cc1a89e9942ae51866775524562`;
  fetchData();
}

function onSuccess(position) {
  const { latitude, longitude } = position.coords; // getting lat and lon of the user device
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=2fb02cc1a89e9942ae51866775524562`;
  fetchData();
}

function onError(error) {
  // if any error occur 
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");

  fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() => {
    infoTxt.innerText = "Something went wrong";
    infoTxt.classList.replace("pending", "error");
  });
}

function weatherDetails(info) {
  if (info.cod == "404") { // if entered city name isn't valid
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {

    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, humidity } = info.main;
    const windSpeed = info.wind.speed;
    const timestamp = info.dt;
    const sunriseTimestamp = info.sys.sunrise;
    const sunsetTimestamp = info.sys.sunset;

    //using custom icons
    if (id == 800) {
      wIcon.src = "icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "icons/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = "icons/rain.svg";
    }

    const sunriseDate = new Date(sunriseTimestamp * 1000);
    const sunsetDate = new Date(sunsetTimestamp * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(timestamp * 1000).toLocaleDateString(undefined, options);

    //passing a particular weather info to a particular element
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
 
    weatherPart.querySelector(".wind span").innerText = `${windSpeed} m/s`;
    weatherPart.querySelector(".date").innerText = formattedDate;
    weatherPart.querySelector(".sunrise").innerText = sunriseDate.toLocaleTimeString();
    weatherPart.querySelector(".sunset").innerText = sunsetDate.toLocaleTimeString();
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
