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
    updateSessionsView("");
    setSessionVisibility(false);
    let movies = data[day];
    let sessions = document.getElementsByClassName('session');
    Array.from(sessions).forEach((el, i) => {
        let movie = movies[i];
        let movieName = el.getElementsByTagName('p')[0];
        movieName.textContent = movie.name;
        el.addEventListener('click', () => {
            chooseSession(movie);
        });
    });
}

function updateDaysView(chosenDay) {
    for (const day of daysElements) {
        day.style.backgroundColor = day.textContent == chosenDay ? 'dodgerblue' : '';
    }
}

function chooseSession(movie) {
    updateSessionsView(movie.session);
    setSessionVisibility(true);
    let curSession = document.querySelector(".current-session");
    let [ movieName, date ] = curSession.getElementsByTagName('h2');
    movieName.textContent = movie.name;
    date.textContent = movie.session;
    let seats = document.getElementsByClassName('seat');
    Array.from(seats).forEach((el, i) => {
        el.style.backgroundColor = movie.seats[i] ? 'aquamarine' : 'black'; 
    })
}

function updateSessionsView(chosenSession) {
    let sessions = document.getElementsByClassName('session');
    for (const session of sessions) {
        let time = session.getElementsByTagName('h4')[0];
        session.style.backgroundColor = time.textContent == chosenSession ? 'dodgerblue' : '';
    }
}

function setSessionVisibility(isVisisible) {
    let curSession = document.querySelector(".current-session");
    curSession.style.display = isVisisible ? 'block' : 'none';
}