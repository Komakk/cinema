
let days = document.getElementsByClassName('day');
let today = Date.now();
for (const day of days) {
    let date = new Date(today);
    day.textContent = date.getDate() + '.' + (date.getMonth() + 1);
    today += 86400000;
}