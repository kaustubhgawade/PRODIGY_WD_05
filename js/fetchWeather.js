let search = document.getElementById("search");
let searchBtn = document.getElementById("search-btn");
let checkBox = document.getElementById("switch");
let units = document.getElementById("unit-display");
let locationData, currentConditionsData, hourlyForecastData, dailyForecastData;


checkBox.addEventListener("click", () => {
  if (checkBox.checked) {
    units.textContent = "Metric";
  } else {
    units.textContent = "Imperical";
  }
});

searchBtn.addEventListener("click", searchFor);
function searchFor() {
  let searchValue = search.value.trim();
  search.value = "";
  let unit = checkBox.checked ? true : false;

  if (searchValue==""){
    alert("Enter a city name!")
  }
  else if(searchValue != "" && navigator.onLine ) {
    fetchWeatherConditions(searchValue, unit);
  }
}

// ------------------------------------------------------------------------
// Getting weather

async function fetchWeatherConditions(location, unit) {
  const API_KEY = "<YOUR-API-KEY>"; // API KEY

  
  let details = "true";
  let apiUrl =
    "http://dataservice.accuweather.com/locations/v1/cities/search?q=" +
    location +
    "&apikey=" +
    API_KEY;

  try {
    // ------------------------------------Location Data------------------------------------
    const result = await fetch(apiUrl);
    locationData = await result.json();
    locationData = locationData[0];
    let locationKey = locationData.Key;

    // ------------------------------------Current Conditions------------------------------------
    // Getting CURRENT CONDITIONS for the location
    let currentConditionsURL =
      "http://dataservice.accuweather.com/currentconditions/v1/" +
      locationKey +
      "?&apikey=" +
      API_KEY +
      "&details=" +
      details;
    try {
      const currentConditions = await fetch(currentConditionsURL);
      currentConditionsData = await currentConditions.json();
      currentConditionsData = currentConditionsData[0];
    } catch (err) {
      console.error(err);
    }

    // ------------------------------------Hourly forecast------------------------------------
    // Getting FUTURE FORECAST(HOURLY) for the location
    let hourlyForecastURL =
      "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/" +
      locationKey +
      "?&apikey=" +
      API_KEY +
      "&metric=" +
      unit;
    try {
      const hourlyForecast = await fetch(hourlyForecastURL);
      hourlyForecastData = await hourlyForecast.json();
    } catch (err) {
      console.error(err);
    }

    // ------------------------------------Daily forecast------------------------------------
    // Getting FUTURE FORECAST(DAILY) for the location
    let dailyForecastURL =
      "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" +
      locationKey +
      "?&apikey=" +
      API_KEY +
      "&metric=" +
      unit;
    try {
      const dailyForecast = await fetch(dailyForecastURL);
      dailyForecastData = await dailyForecast.json();
    } catch (err) {
      console.error(err);
    }

    displayLocationData(locationData);
    displayCurrentConditionsdata(currentConditionsData, unit);
    displayHourlyForecastData(hourlyForecastData);
    displayDailyForecastData(dailyForecastData);
  } catch (err) {
    console.error(err);
  }
}

// location data
function displayLocationData(data) {
  let name = data.EnglishName;
  let country = data.Country.ID;
  let areaName = document.querySelector("#main-weather h1");
  areaName.textContent = `${name}, ${country}`;
}

// current conditions data
function displayCurrentConditionsdata(data, unit) {
  let precipitation = "0%";
  if (data.HasPrecipitation) {
    precipitation = data.Precipitation.Type;
  }

  let weatherIcon,
    weatherText,
    humidity,
    windDirection,
    uvIndex,
    uvIndexText,
    cloudCover;

  weatherIcon = data.WeatherIcon;
  weatherText = data.WeatherText;
  humidity = data.RelativeHumidity;
  windDirection = data.Wind.Direction.English;
  uvIndex = data.UVIndex;
  uvIndexText = data.UVIndexText;
  cloudCover = data.CloudCover;

  let temperature, feelsLike, windSpeed, visibility, pressure;
  if (unit) {
    temperature =
      data.Temperature.Metric.Value + " " + data.Temperature.Metric.Unit;
    feelsLike =
      data.RealFeelTemperature.Metric.Value +
      " " +
      data.RealFeelTemperature.Metric.Unit;
    windSpeed =
      data.Wind.Speed.Metric.Value + " " + data.Wind.Speed.Metric.Unit; //km/h
    visibility =
      data.Visibility.Metric.Value + " " + data.Visibility.Metric.Unit; //km
    pressure = data.Pressure.Metric.Value + " " + data.Pressure.Metric.Unit; //mb
  } else {
    temperature =
      data.Temperature.Imperial.Value + " " + data.Temperature.Imperial.Unit;
    feelsLike =
      data.RealFeelTemperature.Imperial.Value +
      " " +
      data.RealFeelTemperature.Imperial.Unit;
    windSpeed =
      data.Wind.Speed.Imperial.Value + " " + data.Wind.Speed.Imperial.Unit; //mi/h
    visibility =
      data.Visibility.Imperial.Value + " " + data.Visibility.Imperial.Unit; //mi
    pressure = data.Pressure.Imperial.Value + " " + data.Pressure.Imperial.Unit; //inHg
  }

  let descHTML = document.getElementById("desc-val");
  let precipitationHTML = document.getElementById("chances-precipitation-val");
  let tempHTML = document.getElementById("main-temp");
  let weatherImgHTML = document.querySelector(".weather-img img");
  let srcLinkMainWeatherIcon = "../img/weather-icons/" + weatherIcon + ".png";
  let feelsLikeHTML = document.getElementById("feels-like-val");
  let windHTML = document.getElementById("wind-val");
  let visibilityHTML = document.getElementById("visibility-val");
  let pressureHTML = document.getElementById("pressure-val");

  descHTML.textContent = weatherText;
  precipitationHTML.textContent = precipitation;
  tempHTML.textContent = temperature;
  weatherImgHTML.setAttribute("src", srcLinkMainWeatherIcon);
  feelsLikeHTML.textContent = feelsLike;
  windHTML.textContent = windSpeed;
  visibilityHTML.textContent = visibility;
  pressureHTML.textContent = pressure;
}

// hourly forecast
function displayHourlyForecastData(hourlyForecastData, unit) {
  let hourlyForecastTime = document.querySelectorAll(
    ".hourly-forecast .hf-time"
  );
  let hourlyForecastWeather = document.querySelectorAll(
    ".hourly-forecast .hf-weather-img img"
  );
  let hourlyForecastTemp = document.querySelectorAll(
    ".hourly-forecast .hf-temp"
  );
  for (let i = 0; i < 6; i++) {
    let epochTime = hourlyForecastData[i].EpochDateTime;
    let milliseconds = epochTime * 1000;
    let date = new Date(milliseconds);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let temperature;
    if (unit) {
      temperature =
        hourlyForecastData[i].Temperature.Value +
        " " +
        hourlyForecastData[i].Temperature.Unit;
    } else {
      temperature =
        hourlyForecastData[i].Temperature.Value +
        " " +
        hourlyForecastData[i].Temperature.Unit;
    }

    let formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    let weatherIcon = hourlyForecastData[i].WeatherIcon;
    let weatherIconLink = "../img/weather-icons/" + weatherIcon + ".png";
    // let precipitationProbability = hourlyForecastData[i].PrecipitationProbability;

    hourlyForecastTime[i].textContent = formattedTime;
    hourlyForecastWeather[i].setAttribute("src", weatherIconLink);
    hourlyForecastTemp[i].textContent = temperature;
  }
}

// daily forecast
function displayDailyForecastData(dailyForecastData, unit) {
  let DFData = dailyForecastData;
  let eachWeekDay = document.querySelectorAll(".ff-weekday-name");
  let weatherImg = document.querySelectorAll(".ff-weather-img-desc img");
  let weatherDesc = document.querySelectorAll(".ff-img-desc");
  let minValTemp = document.querySelectorAll(".ff-min-temp");
  let maxValTemp = document.querySelectorAll(".ff-max-temp");
  let dt = new Date();

  for (let i = 0; i < 5; i++) {
    // Days
    let weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    let day = dt.getDay() + i;
    if (day > 6) {
      day = day % 7;
    }
    day = weekDays[day];

    // Img and description
    let ffIcon, ffDescription;
    let currentHour = dt.getHours();
    if (currentHour >= 6 && currentHour <= 19) {
      // day
      ffIcon = DFData.DailyForecasts[i].Day.Icon;
      ffDescription = DFData.DailyForecasts[i].Day.IconPhrase;
    } else {
      // night
      ffIcon = DFData.DailyForecasts[i].Night.Icon;
      ffDescription = DFData.DailyForecasts[i].Night.IconPhrase;
    }
    let ffIconImgLink = "../img/weather-icons/" + ffIcon + ".png";

    // Minimum and Maximum temperature
    let minTemperature, maxTemperature;
    if (unit) {
      minTemperature = DFData.DailyForecasts[i].Temperature.Minimum.Value;
      maxTemperature = DFData.DailyForecasts[i].Temperature.Maximum.Value;
    } else {
      minTemperature = DFData.DailyForecasts[i].Temperature.Minimum.Value;
      maxTemperature = DFData.DailyForecasts[i].Temperature.Maximum.Value;
    }

    eachWeekDay[i].textContent = day;
    weatherImg[i].setAttribute("src", ffIconImgLink);
    weatherDesc[i].textContent = ffDescription;
    minValTemp[i].innerHTML = minTemperature;
    maxValTemp[i].innerHTML = maxTemperature;
  }
}

fetchWeatherConditions("Mumbai", true);