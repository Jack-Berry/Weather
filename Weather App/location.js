const rootRef = document.getElementById("root");

import {
  convertDate,
  hourArrow,
  dayHover,
  bgColour,
  borderColour,
  popFill,
  toastTime,
} from "./domUtils.js";

import { generateHTML, appendHTML } from "./buildStuff.js";
import { spinner } from "./htmlBits.js";

//lazy console log
function xx(...thing) {
  console.log(...thing);
}

navigator.geolocation.getCurrentPosition(success, error);

function success(data) {
  const { latitude, longitude } = data.coords;
  getWeather(latitude, longitude);
  xx(longitude, latitude);
}

function error(error) {
  noLocation();
  xx("Error", error);
}

// Builds the search if location denied
function noLocation() {
  // CURRENT DIV
  appendHTML("root", generateHTML("div", "current", "current"));
  // Search location
  // Location
  appendHTML("current", generateHTML("h1", "Where?"));

  appendHTML(
    "current",
    generateHTML("div", "searchContainer", "searchContainer")
  );

  appendHTML(
    "searchContainer",
    generateHTML("input", "search", " Search for location")
  );

  appendHTML(
    "searchContainer",
    generateHTML("button", "searchButton", "Search")
  );
  const input = document.getElementById("search");
  const button = document.getElementById("searchButton");
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchPressed(input);
    }
  });
  button.addEventListener("click", (e) => {
    xx(search.value);
    searchPressed(input);
  });
}

// Handles button press and passes data
function searchPressed(input) {
  let search = input;
  getSearch(search.value);
}

// Converts string to long-lat
async function getSearch(place) {
  try {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=91463758243d44af0d8f7654ebd03f08`;
    let result = await fetch(url);
    result = await result.json();
    let latitude = result[0].lat;
    let longitude = result[0].lon;
    // let refresh = document.getElementById("root");
    // rootRef.innerHTML = "";
    getWeather(latitude, longitude);
  } catch (e) {
    xx("THIS IS WHY - SEARCH BUTTON", e);
    toastTime("search", "Not a valid location", 2500);
  }
}

// Make API Calls
async function getWeather(latitude, longitude) {
  rootRef.innerHTML = spinner;
  try {
    // Weather API
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&appid=91463758243d44af0d8f7654ebd03f08`;
    // Weather data
    let result = await fetch(url);
    result = await result.json();
    xx(result);

    // Geo API
    const locationURL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=91463758243d44af0d8f7654ebd03f08`;
    // Geo data
    let locationRes = await fetch(locationURL);
    locationRes = await locationRes.json();
    rootRef.innerHTML = "";
    showWeather(result, locationRes);
  } catch (e) {
    rootRef.innerHTML = "";
    xx("THIS IS WHY - API BIT", e);
    toastTime("root", "Please, try searching for a location instead", 4000);
    setTimeout(() => {
      noLocation();
    }, 4000);
  }
}

// Uses the buildStuff.js funcs to generate the dom using the API data
function showWeather(result, locationRes) {
  // CURRENT DIV
  appendHTML("root", generateHTML("div", "current", "current"));
  // Location
  appendHTML("current", generateHTML("h1", locationRes[0].name));
  // Description
  appendHTML(
    "current",
    generateHTML("h2", result.current.weather[0].description)
  );
  // Temp
  let temp = Math.round(result.current.temp - 273.15);
  appendHTML("current", generateHTML("h2", temp + " C"));
  // Icon
  let icon = result.current.weather[0].icon;
  appendHTML(
    "current",
    generateHTML(
      "img",
      `https://openweathermap.org/img/wn/${icon}@4x.png`,
      "currentIcon"
    )
  );
  bgColour(temp);

  // Search location

  appendHTML(
    "current",
    generateHTML("div", "searchContainer", "searchContainer")
  );

  appendHTML(
    "searchContainer",
    generateHTML("input", "search", " Search for location")
  );

  appendHTML(
    "searchContainer",
    generateHTML("button", "searchButton", "Search")
  );
  const input = document.getElementById("search");
  const button = document.getElementById("searchButton");
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchPressed(input);
    }
  });
  button.addEventListener("click", (e) => {
    xx(search.value);
    searchPressed(input);
  });

  // Hourly probability of precip
  appendHTML("current", generateHTML("div", "pop", "popBox"));
  appendHTML("pop", generateHTML("p", "Chance of rain (Hr)"));
  appendHTML("pop", generateHTML("div", "popContainer", "popContainer"));
  appendHTML("popContainer", generateHTML("div", "popBar"));
  appendHTML("popContainer", generateHTML("p", ""));
  popFill(result.hourly[0].pop);

  // HOURLY DIV
  appendHTML("root", generateHTML("div", "hourly", "hourly"));
  appendHTML(
    "hourly",
    generateHTML("img", "right-arrow.png", "hourRightArrow")
  );
  appendHTML("hourly", generateHTML("img", "left-arrow.png", "hourLeftArrow"));
  appendHTML("hourly", generateHTML("h1", "Hourly Forecast"));
  appendHTML("hourly", generateHTML("div", "hours", "hours"));
  // Hourly layout
  hourly("hours", result.hourly);
  hourArrow("hourRightArrow", "hourLeftArrow", "hours");

  // DAILY DIV
  appendHTML("root", generateHTML("div", "daily", "daily"));
  appendHTML("daily", generateHTML("img", "right-arrow.png", "dayRightArrow"));
  appendHTML("daily", generateHTML("img", "left-arrow.png", "dayLeftArrow"));
  appendHTML("daily", generateHTML("h1", "Daily Forecast"));
  appendHTML("daily", generateHTML("div", "days", "days"));
  // Day layout
  daily("days", result.daily);
  hourArrow("dayRightArrow", "dayLeftArrow", "days");
}

// Constructs hourly forecast
function hourly(id, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (i <= 6) {
      appendHTML(id, generateHTML("div", `hour${i}`, "hourContainer"));
      let hour = convertDate(arr[i].dt).getHours() + ":00";
      appendHTML(`hour${i}`, generateHTML("h2", hour));
      let temp = Math.round(arr[i].temp - 273.15);
      appendHTML(`hour${i}`, generateHTML("h2", temp + " C"));
      let icon = arr[i].weather[0].icon;
      appendHTML(
        `hour${i}`,
        generateHTML("img", `https://openweathermap.org/img/wn/${icon}.png`)
      );
      appendHTML(`hour${i}`, generateHTML("p", arr[i].weather[0].description));
      let container = document.getElementById(`hour${i}`);
      let text = document.querySelector(`#hour${i} p`);
      dayHover(container, text);
      borderColour(temp, `hour${i}`);
    } else {
      return;
    }
  }
}

// Constucts daily forecast
function daily(id, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (i <= 7) {
      appendHTML(id, generateHTML("div", `day${i}`, "dayContainer"));

      let day = convertDate(arr[i].dt).getDay();
      let dayArr = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      if (i === 0) {
        appendHTML(`day${i}`, generateHTML("h2", "Today"));
      }
      if (i === 1) {
        appendHTML(`day${i}`, generateHTML("h2", "Tomorrow"));
      }
      if (i > 1) {
        appendHTML(`day${i}`, generateHTML("h2", dayArr[day]));
      }

      let icon = arr[i].weather[0].icon;
      appendHTML(
        `day${i}`,
        generateHTML("img", `https://openweathermap.org/img/wn/${icon}.png`)
      );

      let maxTemp = Math.round(arr[i].temp.max - 273.15);
      let minTemp = Math.round(arr[i].temp.min - 273.15);
      appendHTML(`day${i}`, generateHTML("h2", `Max ${maxTemp}C`));
      appendHTML(`day${i}`, generateHTML("h2", `Min ${minTemp}C`));
      appendHTML(`day${i}`, generateHTML("p", arr[i].summary));
      let container = document.getElementById(`day${i}`);
      let text = document.querySelector(`#day${i} p`);
      dayHover(container, text);
      borderColour(maxTemp, `day${i}`);
    } else {
      return;
    }
  }
}
