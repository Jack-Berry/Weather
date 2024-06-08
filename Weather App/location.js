const rootRef = document.getElementById("root");

//lazy console log
function xx(thing) {
  console.log(thing);
}

navigator.geolocation.getCurrentPosition(success, error);

function success(coords) {
  const { latitude, longitude } = coords;
  // getWeather(latitude, longitude);
  var tempLatitude = 53.2483843;
  var tempLongitude = -2.1186255;
  getWeather(tempLatitude, tempLongitude);
}

function error(error) {
  xx("Error", error);
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
      return img;

    case "div":
      let div = document.createElement("div");
      div.id = content;
      div.className = bonus;
      return div;

    default:
      let text = document.createTextNode(content);
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
    generateHTML("img", `https://openweathermap.org/img/wn/${icon}@4x.png`)
  );
  // Hourly probability of precip
  appendHTML("current", generateHTML("div", "pop", "popBox"));
  appendHTML("pop", generateHTML("p", "Chance of rain"));
  appendHTML("pop", generateHTML("div", "popContainer", "popContainer"));
  appendHTML("popContainer", generateHTML("div", "popBar"));
  appendHTML("popContainer", generateHTML("p", ""));
  popFill(result.hourly[0].pop);

  // HOURLY DIV
  appendHTML("root", generateHTML("div", "hourly", "hourly"));
  appendHTML("hourly", generateHTML("h1", "Hourly Forecast"));
  // Hourly layout
  hourly("hourly", result.hourly);

  // DAILY DIV
  appendHTML("root", generateHTML("div", "daily", "daily"));
  appendHTML("daily", generateHTML("h1", "Daily Forecast"));
  // Day layout
  daily("daily", result.daily);
}

// Controls the percipitation widgit
function popFill(data) {
  let percentage = data;
  // let percentage = 30;
  let container = document.getElementById("popBar");
  let text = document.querySelector(".popContainer p");
  container.style.height = `${percentage}%`;
  text.innerText = `${percentage}%`;
  container.style.bottom = "0";
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
    } else {
      return;
    }
  }
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
    } else {
      return;
    }
  }
}
function dayHover(day, item) {
  day.addEventListener("mouseover", (e) => {
    item.style.display = "block";
  });
  day.addEventListener("mouseleave", (e) => {
    item.style.display = "none";
  });
}

function convertDate(time) {
  let unix = time;
  let date = new Date(unix * 1000);
  return date;
}
