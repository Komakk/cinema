import { data } from "./data";

let days = document.getElementsByClassName('day');
let today = Date.now();
for (const day of days) {
    let date = new Date(today);
    let dayOfMounth = date.getDate() + '.' + (date.getMonth() + 1);
    day.textContent = dayOfMounth;
    today += 86400000;
}