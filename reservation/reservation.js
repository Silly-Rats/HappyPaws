let service_select = document.getElementById('service');
let trainer_select = document.getElementById('Trainer');
let dog_breed_select = document.getElementById('dog_breed');
let dog_size_select = document.getElementById('dog-size');
service_select.addEventListener('change', function() {
    let service_select_value = service_select.value;
    console.log(service_select_value);

    trainer_select.innerHTML = '';

    if (service_select_value === 'training'){
        fetch('http://localhost:8080/api/user/trainer')
            .then((response) => response.json()
                .then((trainers) => {

                    for (const trainer of trainers) {
                        let option = document.createElement('option');
                        option.innerText = `${trainer.firstName} ${trainer.lastName}`;
                        trainer_select.value = `${trainer.firstName} ${trainer.lastName}`;
                        trainer_select.appendChild(option);
                    }

                }));

        trainer_select.addEventListener("change", function () {
            const trainer_select_value = trainer_select.value;
            console.log(trainer_select_value);
        });

    } else if (service_select_value === 'grooming'){
        fetch('http://localhost:8080/api/user/groomer')
            .then((response) => response.json()
                .then((groomers) => {
                    for (const groomer of groomers) {
                        let option = document.createElement('option');
                        option.innerText = `${groomer.firstName} ${groomer.lastName}`;
                        trainer_select.value = `${groomer.firstName} ${groomer.lastName}`;
                        trainer_select.appendChild(option);
                    }

                }));
    }
});

fetch('http://localhost:8080/api/dog/breeds')

    .then((response) => response.json()
        .then((dog_breeds) => {
            for (const dog_breed of dog_breeds) {
                let option = document.createElement('option');
                option.innerText = `${dog_breed.name}`;
                dog_breed_select.value = `${dog_breed.name}`;
                dog_breed_select.appendChild(option);
            }
        }));

const calendarBody = document.getElementById('calendarBody');
const currentMonthLabel = document.getElementById('currentMonthLabel');
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
currentMonthLabel.textContent = monthNames[currentMonth] + ' ' + currentYear;
function generateCalendar() {
    calendarBody.innerHTML = '';

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < weekdays.length; i++) {
        const weekday = document.createElement('div');
        weekday.classList.add('name_day');
        weekday.textContent = weekdays[i];
        calendarBody.appendChild(weekday);
    }

    // Generate blank spaces for previous days
    const previousMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
        const blankDay = document.createElement('div');
        blankDay.classList.add('day', 'disabled');
        blankDay.textContent = previousMonthLastDate - i;
        calendarBody.appendChild(blankDay);
    }

// Generate days for current month
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('day');

        if (i === todayDate && currentMonth === todayMonth && currentYear === todayYear) {
            // Check if today is Sunday
            if (new Date(currentYear, currentMonth, i).getDay() === 0) {
                // If today is Sunday, apply 'sunday' class and hide the element
                day.classList.add('sunday');
            } else {
                // Otherwise, apply 'today' class
                day.classList.add('today');
            }
        } else if ((i + adjustedFirstDay - 1) % 7 === 6) { // Check if it's Sunday
            day.classList.add('sunday');
        } else if (new Date(currentYear, currentMonth, i) < new Date(todayYear, todayMonth, todayDate) ||
            new Date(currentYear, currentMonth, i) > new Date(todayYear, todayMonth, todayDate + 30)) {
            day.classList.add('disabled');
        }

        day.textContent = i;
        calendarBody.appendChild(day);
    }


    // Fill the rest of the calendar with days from the next month (if needed)
    const lastDay = new Date(currentYear, currentMonth, daysInMonth).getDay();
    const remainingDays = 6 - ((lastDay === 0) ? 6 : lastDay); // Remaining days to fill

    // Fill remaining days from the next month
    for (let i = 0; i < remainingDays; i++) {
        const nextMonthDay = document.createElement('div');
        nextMonthDay.classList.add('day', 'disabled');
        nextMonthDay.textContent = i + 1;
        calendarBody.appendChild(nextMonthDay);
    }
}


// Function to show previous month
function prevMonth() {
    currentMonth--;
    if (currentMonth < new Date().getMonth() && currentYear <= new Date().getFullYear()) {
        currentMonth = new Date().getMonth();
    }
    updateMonthHeader();
    generateCalendar();
}

// Function to show next month
function nextMonth() {
    currentMonth++;
    if (currentYear === new Date().getFullYear() && currentMonth > new Date().getMonth() + 1) {
        currentMonth = new Date().getMonth() + 1;
    } else if (currentYear > new Date().getFullYear()) {
        currentMonth = 12; // Якщо поточний рік більше поточного, то можемо переглянути будь-який місяць наступного року
    }
    updateMonthHeader();
    generateCalendar();
}


// Function to update month header
function updateMonthHeader() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthLabel.textContent = monthNames[currentMonth] + ' ' + currentYear;
}

// Initial call to generate calendar
generateCalendar();


