import { data } from "./data.js";

let days = document.getElementsByClassName('day');
let today = Date.now();
for (const day of days) {
    let date = new Date(today);
    let dayOfMounth = date.getDate() + '.' + (date.getMonth() + 1);
    day.textContent = dayOfMounth;
    today += 86400000;

    day.addEventListener('click', updateSessions(dayOfMounth));
}
//updateSessions('10.10');

function updateSessions(day) {
    let movies = data[day];
    let sessions = document.getElementsByClassName('session');
    Array.from(sessions).forEach((el, i) => {
        let movie = movies[i];
        let movieName = document.createTextNode(movie.name);
        el.appendChild(movieName);
        el.addEventListener('click',updateCurrentSession(movie));
    });
}

function updateCurrentSession(movie) {

}