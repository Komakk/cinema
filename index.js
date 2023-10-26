
let dayElements = document.getElementsByName('days');
let datePicker = document.querySelector('.datepicker-input');
let seatElements = document.getElementsByClassName('seat');
let reservedSeat = document.getElementById('reserved-seat');

let data;
let localStorageData = localStorage.getItem('data');
if (localStorageData !== null) {
    data = JSON.parse(localStorageData);
    loadTodayData();
} else {
    fetch('./data.json')
        .then(res => res.json())
        .then(json => {
            data = json;
            loadTodayData();
        });
}

for (const dayEl of dayElements) {

    dayEl.addEventListener('click', (e) => {
        let elDate = e.target.value;
        updateDaysView(elDate);
        setDatePickerValue(elDate);
        updateSessionsView("");
        setSessionVisibility(false);
        chooseDay(elDate);
    })
}

datePicker.addEventListener('change', (e) => {
    let pickedDay = e.target.value;
    updateDaysView(pickedDay);
    updateSessionsView("");
    setSessionVisibility(false);
    chooseDay(pickedDay);
})

function setDatePickerValue(chosenDay) {
    datePicker.value = chosenDay;
}

function loadTodayData() {
    let currentDate = '2023-10-24';
    chooseDay(currentDate);
    updateDaysView(currentDate);
}

function chooseDay(day) {
    let movies = data[day];
    let sessions = document.getElementsByClassName('session');
    Array.from(sessions).forEach((el, i) => {
        let movie = movies[i];
        let movieName = el.getElementsByTagName('p')[0];
        movieName.textContent = movie.name;
        el.onclick = () => {
            chooseSession(movie);
        };
    });
}

function updateDaysView(chosenDay) {
    for (const day of dayElements) {
        day.style.backgroundColor = day.dataset.date == chosenDay ? 'dodgerblue' : '';
    }
}

function chooseSession(movie) {
    console.log(movie);
    updateSessionsView(movie.session);
    setSessionVisibility(true);
    let curSession = document.querySelector(".current-session");
    let [ movieName, date ] = curSession.getElementsByTagName('h2');
    movieName.textContent = movie.name;
    date.textContent = movie.session;
    updateSeatsView(movie.seats);
    countReservedSeats();

    Array.from(seatElements).forEach((el, i) => {
        if (movie.seats[i] != 1) {
            el.onclick = () => {
                movie.seats[i] =  movie.seats[i] != 2 ? 2 : 0;
                updateSeatsView(movie.seats);
                countReservedSeats();
                localStorage.setItem('data', JSON.stringify(data));
            };
        }
    });
}

function updateSessionsView(chosenSession) {
    let sessions = document.getElementsByClassName('session');
    for (const session of sessions) {
        let time = session.getElementsByTagName('h4')[0];
        session.style.backgroundColor = time.textContent == chosenSession ? 'dodgerblue' : '';
    }
}

function setSessionVisibility(isVisible) {
    let curSession = document.querySelector(".current-session");
    curSession.style.display = isVisible ? 'block' : 'none';
}

function updateSeatsView(movieSeats) {
    Array.from(seatElements).forEach((el, i) => {
        el.classList.remove('occupaied-seat', 'picked-seat');
        switch (movieSeats[i]) {
            case 1:
                el.classList.add('occupaied-seat');
                break;
            case 2:
                el.classList.add('picked-seat');
                break;
        }
    });
}

function countReservedSeats() {
    let reservedSeats = [];
    Array.from(seatElements).forEach((el, i) => {
        if (el.classList.contains('picked-seat')) reservedSeats.push(i + 1);
    });
    reservedSeat.textContent = reservedSeats.toString();
}