let dayElements = document.getElementsByName('days');
let datePicker = document.querySelector('.datepicker-input');
let sessionsContainer = document.querySelector('.day-sessions');
let curSession = document.querySelector(".current-session");
let seatElements = document.getElementsByClassName('seat');
let reservedSeat = document.getElementById('reserved-seat');
let buyButton = document.querySelector('.btn-buy');
 
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
        setElementVisibility(curSession, false);
        populateSessions(data[elDate]);
    })
}

datePicker.addEventListener('change', (e) => {
    let pickedDay = e.target.value;
    setElementVisibility(curSession, false);
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

function chooseSession(movie) {
    setElementVisibility(curSession, true);
    setElementVisibility(buyButton, isSessionActive(movie));
    let [ movieName, date ] = curSession.querySelectorAll('.session-info');
    movieName.textContent = movie.name;
    let dateString = new Date(movie.date).toDateString().slice(0, 10);
    date.textContent = dateString + ' ' + movie.session;
    updateSeatsView(movie);
    countReservedSeats();

    Array.from(seatElements).forEach((el, i) => {
        if (isSessionActive(movie) && movie.seats[i] != 1) {
            el.onclick = () => {
                movie.seats[i] =  movie.seats[i] != 2 ? 2 : 0;
                el.classList.toggle('picked-seat');
                countReservedSeats();
                localStorage.setItem('data', JSON.stringify(data));
            };
        } else {
            el.onclick = null;
        }
    });
}

function setElementVisibility(element, isVisible) {
    element.style.display = isVisible ? 'block' : 'none';
}

function updateSeatsView(movie) {
    Array.from(seatElements).forEach((el, i) => {
        el.classList.remove('occupaied-seat', 'picked-seat', 'inactive-seat');
        switch (movie.seats[i]) {
            case 1:
                el.classList.add('occupaied-seat');
                break;
            case 2:
                el.classList.add('picked-seat');
                break;
        }
        if (!isSessionActive(movie)) el.classList.add('inactive-seat');
    });
}

function countReservedSeats() {
    let reservedSeats = [];
    Array.from(seatElements).forEach((el, i) => {
        if (el.classList.contains('picked-seat')) reservedSeats.push(i + 1);
    });
    reservedSeat.textContent = reservedSeats.toString();
    if (reservedSeats.length > 0) {
        buyButton.textContent = 'Buy';
        buyButton.disabled = false;
    } else {
        buyButton.textContent = 'Select seats';
        buyButton.disabled = true;
    }
}

function isSessionActive(session) {
    let currentDate = new Date();
    currentDate.setFullYear(2023);
    currentDate.setMonth(9);
    currentDate.setDate(24);

    let sessionDate = new Date(session.date);
    sessionDate.setHours(session.session.split(':')[0]);

    if (sessionDate.getTime() > currentDate.getTime()) {
        return true;
    } else {
        return false;
    }
}