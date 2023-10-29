
let dayElements = document.getElementsByName('days');
let datePicker = document.querySelector('.datepicker-input');
let sessionsContainer = document.querySelector('.day-sessions');
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
        setDatePickerValue(elDate);
        setSessionVisibility(false);
        populateSessions(data[elDate]);
    })
}

datePicker.addEventListener('change', (e) => {
    let pickedDay = e.target.value;
    setSessionVisibility(false);
    populateSessions(data[pickedDay]);
})

function setDatePickerValue(chosenDay) {
    datePicker.value = chosenDay;
}

function loadTodayData() {
    let currentDate = '2023-10-24';
    populateSessions(data[currentDate]);
}

function populateSessions(movies) {
    sessionsContainer.textContent = '';
    movies.forEach((ses, i) => {
        let input = document.createElement('input');
        input.type = 'radio';
        input.id = i;
        input.name = 'sessions';
        input.onchange = () => chooseSession(ses);
        sessionsContainer.appendChild(input);

        let sessionHTML = `
        <label class="session" for="${i}">
            <span>${ses.session}</span>
            <span>${ses.name}</span>
        </label>`;
        sessionsContainer.insertAdjacentHTML('beforeend', sessionHTML);
    });
}

function updateDaysView(chosenDay) {
    for (const day of dayElements) {
        day.style.backgroundColor = day.dataset.date == chosenDay ? 'dodgerblue' : '';
    }
}

function chooseSession(movie) {
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