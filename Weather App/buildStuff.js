// Contructs HTML of various types
export function generateHTML(tag, content, bonus) {
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

// Appends HTML elements
export function appendHTML(ID, data) {
  let elem = document.getElementById(ID).append(data);
  return elem;
}
