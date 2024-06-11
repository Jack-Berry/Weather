const rootRef = document.getElementById("root");

//lazy console log
function xx(thing) {
  console.log(thing);
}

navigator.geolocation.getCurrentPosition(success, error);

function success(data) {
  const { latitude, longitude } = data.coords;
  getWeather(latitude, longitude);
  xx(longitude, latitude);
}

function error(error) {
  xx("Error", error);
}

// Handles button press and passes data
function searchPressed(input, button) {
  let search = input;
  let _button = button;
  _button.addEventListener("click", (e) => {
    xx(search.value);
    getSearch(search.value);
  });
}

// Converts string to long-lat
async function getSearch(place) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=91463758243d44af0d8f7654ebd03f08`;
  let result = await fetch(url);
  result = await result.json();
  let latitude = result[0].lat;
  let longitude = result[0].lon;
  let refresh = document.getElementById("root");
  refresh.innerHTML = "";
  getWeather(latitude, longitude);
}

// Make API Calls
async function getWeather(latitude, longitude) {
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

  showWeather(result, locationRes);
}

function generateHTML(tag, content, bonus) {
  switch (tag) {
    case "ul":
      let ul = document.createElement("ul");
      content.forEach((element) => {
        let li = document.createElement("li");
        let text = document.createTextNode(element);
        li.append(text);
        ul.append(li);
      });
      return ul;
    case "img":
      let img = document.createElement("img");
      img.src = content;
      img.id = bonus;
      return img;

    case "div":
      let div = document.createElement("div");
      div.id = content;
      div.className = bonus;
      return div;
    case "input":
      let input = document.createElement("input");
      input.id = content;
      input.placeholder = bonus;
      return input;
    case "button":
      let button = document.createElement("button");
      button.id = content;
      button.innerText = bonus;
      return button;

    default:
      let caps = content.charAt(0).toUpperCase() + content.slice(1);
      let text = document.createTextNode(caps);
      let elem = document.createElement(tag);
      elem.append(text);

      return elem;
  }
}

function appendHTML(ID, data) {
  let elem = document.getElementById(ID).append(data);
  return elem;
}

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
  searchPressed(input, button);

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

// Sets background colour of image vs
function bgColour(data) {
  let temp = data;
  let bg = "";
  if (temp >= 30) {
    bg = "red";
  } else if (temp >= 25) {
    bg = "orange";
  } else if (temp >= 20) {
    bg = "DeepSkyBlue";
  } else {
    bg = "SlateGray";
  }
  let img = document.getElementById("currentIcon");
  img.style.backgroundColor = bg;
}

// Controls the percipitation widgit
function popFill(data) {
  let percentage = data * 100;
  // let percentage = 56;
  let container = document.getElementById("popBar");
  let text = document.querySelector(".popContainer p");
  text.innerText = `${percentage}%`;
  if (percentage > 55) {
    text.style.color = "white";
  }
  container.style.bottom = "0";
  // Animation (I know it's not using the loop really but it works!)
  for (let counter = 0; counter < percentage; counter++) {
    setTimeout(() => {
      if (counter < percentage) {
        container.style.height = `${counter}%`;
      } else {
        container.style.height = `${percentage}%`;
        return;
      }
    }, 500);
  }
}

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
function borderColour(data, id) {
  // let temp = Math.round(data.current.temp - 273.15);
  let temp = data;
  let bg = "";
  if (temp >= 30) {
    bg = "red";
  } else if (temp >= 25) {
    bg = "orange";
  } else {
    bg = "white";
  }
  let div = document.getElementById(id);
  div.style.borderColor = bg;
}
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
function dayHover(day, item) {
  day.addEventListener("mouseover", (e) => {
    // item.style.display = "block";
    item.style.opacity = "90%";
    item.style.fontSize = "20px";
  });
  day.addEventListener("mouseleave", (e) => {
    // item.style.display = "none";
    item.style.opacity = "0%";
    item.style.fontSize = "10px";
  });
}
function hourArrow(rightArrow, leftArrow, div) {
  let rArrow = document.getElementById(rightArrow);
  rArrow.role = "button";
  let lArrow = document.getElementById(leftArrow);
  lArrow.role = "button";
  let box = document.getElementById(div);
  rArrow.addEventListener("click", (e) => {
    box.scrollLeft += 700;
    rArrow.style.display = "none";
    lArrow.style.display = "block";
  });
  lArrow.addEventListener("click", (e) => {
    box.scrollLeft -= 700;
    lArrow.style.display = "none";
    rArrow.style.display = "block";
  });
}

function convertDate(time) {
  let unix = time;
  let date = new Date(unix * 1000);
  return date;
}
