import "./style/main.css";
import background from "./image/beach-exotic-holiday.jpg";

var print = msg => {
  console.log(msg);
};

print("hello webpack!");

const arr = [1, 2, 3];
const javascriptES6 = () => console.log(...arr);
javascriptES6();

console.log(background);
var img = document.createElement("img");
img.src = background;

var container = document.getElementById("app");
container.appendChild(img);
