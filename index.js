import { data } from "./data.js";

let daysElements = document.getElementsByClassName('day');
let days = Object.keys(data);

Array.from(daysElements).forEach((el, i) => {
    el.textContent = days[i];
    el.addEventListener('click', () => {
        chooseDay(days[i]);
    });
});

chooseDay('10.10');

function chooseDay(day) {
    updateDaysView(day);
    let movies = data[day];
    let sessions = document.getElementsByClassName('session');
    Array.from(sessions).forEach((el, i) => {
        let movie = movies[i];
        let movieName = el.getElementsByTagName('p')[0];
        movieName.textContent = movie.name;
        el.addEventListener('click', () => {
            updateCurrentSession(movie);
        });
    });
}

function updateDaysView(chosenDay) {
    for (const day of daysElements) {
        day.style.backgroundColor = day.textContent == chosenDay ? 'dodgerblue' : '';
    }
}

function updateCurrentSession(movie) {
    let seats = document.getElementsByClassName('seat');
    Array.from(seats).forEach((el, i) => {
        el.style.backgroundColor = movie.seats[i] ? 'aquamarine' : 'black'; 
    })
}