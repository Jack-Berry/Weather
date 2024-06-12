export function convertDate(time) {
  let unix = time;
  let date = new Date(unix * 1000);
  return date;
}

// Gives arrow buttons functionality
export function hourArrow(rightArrow, leftArrow, div) {
  let rArrow = document.getElementById(rightArrow);
  rArrow.role = "button";
  let lArrow = document.getElementById(leftArrow);
  lArrow.role = "button";
  let box = document.getElementById(div);
  rArrow.addEventListener("click", (e) => {
    box.scrollLeft += 350;
  });
  lArrow.addEventListener("click", (e) => {
    box.scrollLeft -= 350;
  });
}

// Operates hover effects on containers
export function dayHover(day, item) {
  day.addEventListener("mouseover", (e) => {
    item.style.opacity = "90%";
    item.style.fontSize = "20px";
  });
  day.addEventListener("mouseleave", (e) => {
    item.style.opacity = "0%";
    item.style.fontSize = "10px";
  });
}

// Sets background colour of image vs
export function bgColour(data) {
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

export function borderColour(data, id) {
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

// Controls the percipitation widgit
export function popFill(data) {
  let percentage = data * 100;
  // let percentage = 100;
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
