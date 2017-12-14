"use strict";

const app = function () {
let c,
  lat,
  long,
  city,
  region,
  country,
  currentTemp,
  weatherApi,
  date = new Date();

const ipApi = "http://ip-api.com/json";
const weatherUrl = "http://api.openweathermap.org/data/2.5/weather?";
const appid = "&APPID=0abc45612224ae478acae89ab18bc3de";
const units = "&units=metric";

//display date and time
function displayDate() {
  $('#today-is').text(date);
}
displayDate();

console.log(new Date().toUTCString());
console.log(new Date().getDay());

//displays the temperature as C by default
function displayTemp() {
  $('.temp-display').text(Math.floor(currentTemp) + "°C");
  $('#c-f').text("Change to F");
  c = true;
}

//displays the temperature as F
function displayF() {
  $('.temp-display').text(Math.floor(currentTemp * 9 / 5 + 32) + "°F");
  $('#c-f').text("Change to C");
  c = false;
}

//changes between C and F
function toggler() {
  $('#c-f').click(function() {
    c ? (displayF()) : (displayTemp());
  });
}

//remembers whether C or F has been chosen for new search
function rememberTemp() {
  c ? (displayTemp()) : (displayF());
}

//displays a short description of the current weather
function displayDescription(description) {
  $('#descrip').text(description);
}

//changes weather icon
function changeIcon(iCode) {
  let iUrl;
  if (iCode === "50d" || iCode === "50n") {
    iUrl = "https://c2.staticflickr.com/4/3861/33395954835_7c4db3de46_o.png";
  } else if (iCode === "02d") {
    iUrl = "https://c2.staticflickr.com/4/3904/33262934491_90070796be_o.png";
  } else if (iCode === "03d" || iCode === "03n" || iCode === "04d" || iCode === "04n") {
    iUrl = "https://c2.staticflickr.com/4/3838/33350077826_ff64d291ea_o.png";
  } else if (iCode === "09d" || iCode === "09n" || iCode === "10d" || iCode === "10n") {
    iUrl = "https://c1.staticflickr.com/1/586/33350078206_8c3e508336_o.png";
  } else if (iCode === "01d") {
    iUrl = "https://c1.staticflickr.com/1/633/32547787054_50a79ff2da_o.png";
  } else if (iCode === "02n") {
    iUrl = "https://c2.staticflickr.com/4/3667/32547791124_f25bdccb99_o.png";
  } else if (iCode === "01n") {
    iUrl = "https://c2.staticflickr.com/4/3716/33262938171_94881efd98_o.png";
  } else if (iCode === "13d" || iCode === "13n") {
    iUrl = "https://c2.staticflickr.com/4/3737/33262938961_7209bd6b25_o.png";
  } else if (iCode === "11d" || iCode === "11n") {
    iUrl = "https://c1.staticflickr.com/1/678/32547792224_93d33d8ae4_o.png";
  }
  $("#weather-icon").attr("src", iUrl);
}

//display new map
function newMap() {
  new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: lat,
      lng: long
    },
    zoom: 11
  });
}

//display map on load
function initMap() {
  setTimeout(function() {
    $('#loading').hide;
    newMap();
  }, 2000);
}

//prevents page from re-loading on submit
$(".search-bar").on("submit", function(evt) {
  evt.preventDefault();
});

//function to call IP API for location data
$.getJSON(ipApi, function(json) {
  lat = json.lat,
    long = json.lon,
    weatherApi = weatherUrl + '&lat=' + lat + '&lon=' + long + units + appid,
    city = json.city,
    region = json.region,
    country = json.country;

  //display current city and country
  $(".current-location").text(city + ", " + region + " " + country);

  //function to call Open Weather API for weather data and display weather
  $.getJSON(weatherApi, function(json) {
    currentTemp = json.main.temp;
    changeIcon(json.weather[0].icon);
    displayF(currentTemp);
    displayDescription(json.weather[0].description);

    //search for new city on form submission
    $("#submit").on("click", function() {
      let searchWeatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=",
        inputCity = document.getElementById("city").value,
        weatherCityApi = searchWeatherUrl + inputCity + units + appid;
      console.log(weatherCityApi);

      //calling open weather API based on input city
      $.getJSON(weatherCityApi, function(json) {
        currentTemp = json.main.temp;
        city = json.name;
        country = json.sys.country;
        lat = json.coord.lat;
        long = json.coord.lon;
        //display current city and country
        $(".current-location").text(city + ", " + country);

        //changes the display city, temperature and weather description in the html
        changeIcon(json.weather[0].icon);
        rememberTemp();
        displayDescription(json.weather[0].description);
        newMap();
      });
    });
    //toggle between F and C for temperature
    toggler();
  });
});
}

module.exports = app
