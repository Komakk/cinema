import { data } from "./data.js";

let date = Date.now();
let dayElements = document.getElementsByClassName('day');
let datePicker = document.querySelector('.datepicker-input');

for (const dayEl of dayElements) {
    const elDate = new Date(date);
    const formattedElDate = elDate.toJSON().split('T')[0];
    date += 86400000;
    dayEl.dataset.date = formattedElDate;
    dayEl.addEventListener('click', () => {
        updateDaysView(formattedElDate);
        setDatePickerValue(formattedElDate);
        updateSessionsView("");
        setSessionVisibility(false);
        chooseDay(formattedElDate);
    })
    if (dayEl.id.includes('aft')) dayEl.textContent = elDate.toDateString().slice(0, 10);
}

datePicker.addEventListener('change', (e) => {
    let pickedDay = e.target.value;
    updateDaysView(pickedDay);
    updateSessionsView("");
    setSessionVisibility(false);
    chooseDay(pickedDay);
})

let todayDate = new Date().toJSON().split('T')[0];
chooseDay(todayDate);
updateDaysView(todayDate);

function setDatePickerValue(chosenDay) {
    datePicker.value = chosenDay;
}

function chooseDay(day) {
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
    for (const day of dayElements) {
        day.style.backgroundColor = day.dataset.date == chosenDay ? 'dodgerblue' : '';
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