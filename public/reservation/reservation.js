document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, select');

    const applyTextStyle = (element) => {
        element.style.color = '#3C3638';
    };

    inputs.forEach((input) => {
        input.addEventListener('input', (event) => {
            applyTextStyle(event.target); // Apply text style when input value changes
        });
    });

    inputs.forEach((select) => {
        select.addEventListener('change', (event) => {
            applyTextStyle(event.target); // Apply text style when option is selected
        });
    });
});
let service_select = document.getElementById('service');
let worker_select = document.getElementById('Trainer');

const dog_breed_select = document.getElementById('dog_breed');
const sizeCheckboxes = document.querySelectorAll('input[type="checkbox"][name="size"]');

fetch('http://localhost:8080/api/dog/breeds')
    .then((response) => response.json())
    .then((dog_breeds) => {
        // Populate the <select> element with dog breed options
        dog_breeds.forEach((dog_breed) => {
            let option = document.createElement('option');
            option.value = dog_breed.name;
            option.innerText = dog_breed.name;
            dog_breed_select.appendChild(option);
        });

        // Add an "Other" option at the end of the select list
        let otherOption = document.createElement('option');
        otherOption.value = 'other';
        otherOption.innerText = 'Other';
        dog_breed_select.appendChild(otherOption);

        // Add an event listener to the dog breed select element
        dog_breed_select.addEventListener('change', (event) => {
            const selectedBreedName = event.target.value;
            const selectedBreed = dog_breeds.find((breed) => breed.name === selectedBreedName);

            // If a breed with the selected name is found
            if (selectedBreed) {
                // Determine the size of the selected breed
                const breedSize = selectedBreed.size;

                // Uncheck all checkboxes before checking the appropriate one
                sizeCheckboxes.forEach((checkbox) => {
                    checkbox.checked = false;
                });

                // Check the checkbox corresponding to the size of the selected breed
                sizeCheckboxes.forEach((checkbox) => {
                    if (breedSize.includes(checkbox.value)) {
                        checkbox.checked = true;
                    }
                });
            }
        });

        // Add click event listeners to enforce single selection behavior for checkboxes
        sizeCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener('click', (event) => {
                // Uncheck all other checkboxes when one is clicked
                sizeCheckboxes.forEach((cb) => {
                    if (cb !== event.target) {
                        cb.checked = false;
                    }
                });
            });
        });
    });

function getFormattedFutureDate(startDate) {
    const futureDate = new Date(startDate);

    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '0');
    const hours = String(futureDate.getHours()).padStart(2, '0');
    const minutes = String(futureDate.getMinutes()).padStart(2, '0');
    const seconds = String(futureDate.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

const today = new Date(); // Поточна дата
const startDate = getFormattedFutureDate(today);

today.setDate(today.getDate() + 30);
const endDate = getFormattedFutureDate(today);

let globalFreeHours = null;
function createDateRangeObject(startDate, endDate) {
    const dateRangeObject = {};

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    // Loop through each date in the range
    while (currentDate < lastDate) {
        const formattedDate = formatDate(currentDate);

        // Set the date in the object with a true value
        dateRangeObject[formattedDate] = true;

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateRangeObject;
}

function findMissingDates(obj1, obj2) {
    const missingDates = [];

    for (const date in obj1) {
        if (obj1.hasOwnProperty(date) && !obj2.hasOwnProperty(date)) {
            missingDates.push(date);
        }
    }

    return missingDates;
}

const dateRangeObject = createDateRangeObject(startDate, endDate);
console.log(dateRangeObject)

let missingDates = [];
console.log(missingDates)


let defaultOption = document.createElement('option');
defaultOption.text = 'Choose trainer';
fetch('http://localhost:8080/api/user/worker/trainer')
    .then(response => response.json())
    .then(trainers => {
        trainers.forEach(trainer => {
            let option = document.createElement('option');
            option.innerText = `${trainer.firstName} ${trainer.lastName}`;
            option.value = trainer.id;
            worker_select.appendChild(option);
        });

        // Add event listener to worker_select for trainer selection
        worker_select.addEventListener('change', function() {
            let selectedTrainerId = worker_select.value;

            if (selectedTrainerId) {
                fetch(`http://localhost:8080/api/reserve/training/free/${selectedTrainerId}?start=${startDate}&end=${endDate}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(freeHours => {
                        console.log(freeHours)
                        globalFreeHours = freeHours;
                        missingDates = findMissingDates(dateRangeObject, freeHours);

                        generateCalendar();
                    })
                    .catch(error => {
                        console.error('Error fetching free hours:', error);
                    });
            }
        });
    })
    .catch(error => {
        console.error('Error fetching trainers:', error);
    });


const calendarBody = document.getElementById('calendarBody');
const currentMonthLabel = document.getElementById('currentMonthLabel');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
currentMonthLabel.textContent = monthNames[currentMonth] + ' ' + currentYear;
function generateCalendar() {
    calendarBody.innerHTML = ''; // Очистити тіло календаря

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Отримати кількість днів у поточному місяці
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // Отримати день тижня для першого дня місяця (0-6, де 0 - неділя)
    const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1; // Адаптований індекс першого дня для розташування календаря
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Відображення міток днів тижня
    for (let i = 0; i < weekdays.length; i++) {
        const weekday = document.createElement('div');
        weekday.classList.add('name_day');
        weekday.textContent = weekdays[i];
        calendarBody.appendChild(weekday);
    }

    // Відображення пустих днів перед першим днем місяця
    const previousMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
        const blankDay = createDayElement(previousMonthLastDate - i, 'disabled');
        calendarBody.appendChild(blankDay);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const day = createDayElement(i, 'day');

        if (i === todayDate && currentMonth === todayMonth && currentYear === todayYear) {
            day.classList.add('today');
        } else if ((i + adjustedFirstDay - 1) % 7 === 6) {
            day.classList.add('sunday');
        } else if (new Date(currentYear, currentMonth, i) < today ||
            new Date(currentYear, currentMonth, i) > new Date(todayYear, todayMonth, todayDate + 29)) {
            day.classList.add('disabled');
        }

        const currentDateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        console.log(currentDateStr)
        if (missingDates.includes(currentDateStr)) {

            day.classList.add('busy_day');
        }

        day.textContent = i;
        calendarBody.appendChild(day);
    }

    const lastDay = new Date(currentYear, currentMonth, daysInMonth).getDay();
    const remainingDays = 6 - ((lastDay === 0) ? 6 : lastDay);
    for (let i = 0; i < remainingDays; i++) {
        const nextMonthDay = createDayElement(i + 1, 'disabled');
        calendarBody.appendChild(nextMonthDay);
    }
}
function createDayElement(dayNumber, cssClass) {
    const day = document.createElement('div');
    day.classList.add('day', cssClass);
    day.textContent = dayNumber;

    day.addEventListener('click', () => {
        const selectedWorkerId = worker_select.value;

        if (!selectedWorkerId) {
            return;
        }

        if (!day.classList.contains('disabled')) {
            const selectedDay = calendarBody.querySelector('.day.day_choose');
            if (selectedDay) {
                selectedDay.classList.remove('day_choose');
            }

            day.classList.add('day_choose');

            const clickedDate = new Date(currentYear, currentMonth, dayNumber);
            const formattedDate = formatDate(clickedDate);
            updateSelectOption(globalFreeHours[formattedDate], formattedDate)
        }

    });

    return day;
}
function updateSelectOption(hoursArray, currentDay) {
    const timeSelect = document.getElementById('time');
    const currentHour = new Date().getHours() + 1; // Get the current hour of the day
    // Clear existing options in the select element
    timeSelect.innerHTML = '';

    // Create a default option for selection
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Choose time';
    timeSelect.appendChild(defaultOption);
    hoursArray.forEach(hour => {
        const hourValue = parseInt(hour.split(':')[0], 10); // Extract the hour value from the hour string
        const today = formatDate(new Date())
        if (currentDay === today){
            if (hourValue > currentHour) {
                const startTime = hour;
                const endTime = addHour(hour);

                const option = document.createElement('option');
                option.value = hour;
                option.textContent = `${startTime} - ${endTime}`;
                timeSelect.appendChild(option);
            }
        }
        else {
            const startTime = hour;
            const endTime = addHour(hour);

            const option = document.createElement('option');
            option.value = hour;
            option.textContent = `${startTime} - ${endTime}`;
            timeSelect.appendChild(option);
        }


    });
}

const listContainer = document.querySelector('.list-container');

const listTable = document.createElement('table');
listTable.classList.add('list-table');

listContainer.appendChild(listTable);
document.querySelector('.button1').addEventListener('click', () => {
    const selectedDay = calendarBody.querySelector('.day.day_choose');

    if (!selectedDay) {
        return;
    }
    const selectedHour = document.getElementById('time').value;

    if (!selectedHour) {
        return;
    }

    // Check if subscription type is selected
    const subscriptionType = document.getElementById('type').value;

    if (!subscriptionType) {
        alert('Please select a subscription type before choosing a training date.');
        return;
    }

    const dayNumber = parseInt(selectedDay.textContent);
    const clickedDate = new Date(currentYear, currentMonth, dayNumber);
    const formattedDate = getFormattedFutureDate(clickedDate);

    if (globalFreeHours && globalFreeHours[formattedDate]) {
        const updatedHours = globalFreeHours[formattedDate].filter(hour => hour !== selectedHour);
        globalFreeHours[formattedDate] = updatedHours;
        updateSelectOption(updatedHours, formattedDate);

        if (updatedHours.length === 0) {
            selectedDay.classList.add('busy_day');
        }
    }

    const dayOfWeek = clickedDate.toLocaleString('en', { weekday: 'long' });
    const monthName = clickedDate.toLocaleString('en', { month: 'long' });
    const year = clickedDate.getFullYear();

    const tableRow = document.createElement('tr');

    const dayOfWeekCell = document.createElement('td');
    dayOfWeekCell.textContent = dayOfWeek;
    dayOfWeekCell.classList.add('dayOfWeekCell');

    const monthCell = document.createElement('td');
    monthCell.textContent = monthName;
    monthCell.classList.add('monthCell');

    const dayNumberCell = document.createElement('td');
    dayNumberCell.textContent = dayNumber;
    dayNumberCell.classList.add('dayNumberCell');

    const yearCell = document.createElement('td');
    yearCell.textContent = year;
    yearCell.classList.add('yearCell');

    const hourCell = document.createElement('td');
    hourCell.textContent = selectedHour;
    hourCell.classList.add('hourCell');

    const addition = document.createElement('td');
    addition.classList.add('addition');
    addition.textContent = '\u22EE';

    tableRow.appendChild(dayOfWeekCell);
    tableRow.appendChild(monthCell);
    tableRow.appendChild(dayNumberCell);
    tableRow.appendChild(yearCell);
    tableRow.appendChild(hourCell);
    tableRow.appendChild(addition);

    // Get the current count of existing rows
    const existingRows = listTable.querySelectorAll('tr');

    if (subscriptionType === 'single') {
        if (existingRows.length > 0) {
            console.log(selectedDay)
            selectedDay.classList.remove('day_choose');


            alert('You have already selected a training date.');
            const timeSelect = document.getElementById('time');
            timeSelect.value = ''; // Reset the value to empty string
            timeSelect.dispatchEvent(new Event('change'));
            return;
        }

    } else if (subscriptionType === 'monthly') {
        if (existingRows.length >= 12) {
            selectedDay.classList.remove('busy_day');
            selectedDay.classList.add('day')
            const timeSelect = document.getElementById('time');
            timeSelect.value = ''; // Reset the value to empty string
            timeSelect.dispatchEvent(new Event('change'));
            alert('You have reached the limit of 12 training dates for multiple subscriptions.');

            return;
        }
        selectedDay.classList.remove('busy_day');
        selectedDay.classList.add('day')
    }
    listTable.appendChild(tableRow);

    // Reset selected day and time
    selectedDay.classList.remove('day_choose');
    selectedDay.classList.add('busy_day');
    const timeSelect = document.getElementById('time');
    timeSelect.value = ''; // Reset the value to empty string
    timeSelect.dispatchEvent(new Event('change'));

    listContainer.addEventListener('click', (event) => {
        const targetRow = event.target.closest('tr'); // Find the closest table row ancestor

        if (targetRow && listContainer.contains(targetRow)) {
            const confirmation = confirm('Are you sure you want to delete this training date?');

            if (confirmation) {
                // Retrieve day number from the table row
                const dayNumberCell = targetRow.querySelector('.dayNumberCell');
                if (dayNumberCell) {
                    const day = dayNumberCell.textContent; // Get the day number as text

                    // Find the corresponding day element in calendarBody
                    const calendarDay = Array.from(calendarBody.querySelectorAll('.day'))
                        .find(dayElement => dayElement.textContent.trim() === day);

                    if (calendarDay) {
                        calendarDay.classList.remove('busy_day')
                    } else {
                        console.log('No matching calendar day found for', day);
                    }

                    // Remove the table row from the list container
                    targetRow.remove();
                }
            }
        }
    });

});


function addHour(time) {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);

    const nextHour = (hour + 1) % 24; // Ensure the hour remains within 0-23 range
    const nextHourStr = String(nextHour).padStart(2, '0');

    return `${nextHourStr}:${minuteStr}`;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function prevMonth() {
    currentMonth--;
    if (currentMonth < new Date().getMonth() && currentYear <= new Date().getFullYear()) {
        currentMonth = new Date().getMonth();
    }
    updateMonthHeader();
    generateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentYear === new Date().getFullYear() && currentMonth > new Date().getMonth() + 1) {
        currentMonth = new Date().getMonth() + 1;
    } else if (currentYear > new Date().getFullYear()) {
        currentMonth = 12;
    }
    updateMonthHeader();
    generateCalendar();
}

function updateMonthHeader() {
    currentMonthLabel.textContent = monthNames[currentMonth] + ' ' + currentYear;
}


generateCalendar();

const confirmButton = document.getElementById('confirmButton');

function formatISODate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    return formattedDate;
}



const token = localStorage.getItem('token');

function fetchAndPopulateUserData() {
    fetch('http://localhost:8080/api/user/info', {
        headers: {
            'Authorization': token,
            'Content-type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(userData => {

            populateUserData(userData); // Populate user data once retrieved
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

function populateUserData(userData) {
    document.getElementById('name').value = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('email').value = userData.email;
    document.getElementById('phone').value = userData.phoneNum;
}
function fetchAndPopulateDogs() {
    fetch('http://localhost:8080/api/dog/user', {
        headers: {
            'Authorization': token,
            'Content-type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(dogData => {
            populateDogSelection(dogData); // Populate dog selection dropdown once retrieved
        })
        .catch(error => {
            console.error('Error fetching dogs:', error);
        });
}
function populateDogSelection(dogData) {
    const dogNameSelect = document.getElementById('dog-name-select');
    dogNameSelect.style.display = 'block'; // Show the dog selection dropdown
    document.getElementById('dog-name').style.display = 'none';
    dogNameSelect.addEventListener('change', (event) => {
        const selectedDogName = event.target.value;
        const selectedDog = dogData.find(dog => dog.name === selectedDogName);

        if (selectedDog) {

            populateDogInfo(selectedDog); // Populate dog breed and size based on selection
        }
    });

    dogData.forEach(dog => {
        let option = document.createElement('option');
        option.text = dog.name;
        option.value = dog.name;
        dogNameSelect.add(option); // Add each dog name as an option in the dropdown
    });
}
function populateDogInfo(selectedDog) {
    const dogBreedSelect = document.getElementById('dog_breed');

    let breedFound = false;

    // Loop through the options to find the one matching the selected dog's breed
    for (let i = 0; i < dogBreedSelect.options.length; i++) {
        if (dogBreedSelect.options[i].value === selectedDog.breed.name) {
            dogBreedSelect.selectedIndex = i; // Set the selected index to match the breed
            breedFound = true;
            break;
        }
    }

    // If the breed is not found, select the "Other" option
    if (!breedFound) {
        for (let i = 0; i < dogBreedSelect.options.length; i++) {
            if (dogBreedSelect.options[i].value === 'other') {
                dogBreedSelect.selectedIndex = i; // Set the selected index to "Other"
                break;
            }
        }
    }
    userId = selectedDog.id;
    // Log the selected dog's ID to the console
    console.log('Selected dog ID:', selectedDog.id);

    // Update checkboxes for sizes
    const sizeInputs = document.querySelectorAll('input[name="size"]');
    sizeInputs.forEach(input => {
        input.checked = selectedDog.breed.size.includes(input.value);
    });
}

let userId;

fetchAndPopulateUserData();
fetchAndPopulateDogs();
confirmButton.addEventListener('click', function(event) {
    event.preventDefault();

    const fullName = document.getElementById('name').value;
    const emailInput = document.getElementById('email').value;
    const phoneInput = document.getElementById('phone').value;
    const dogNameInput = document.getElementById('dog-name').value;
    const breedInput = document.getElementById('dog_breed').value;

    const dogNameSelect = document.getElementById('dog-name-select').value;
    const subscriptionTypeElement = document.getElementById('type');
    const subscriptionTypeValue = subscriptionTypeElement.value;
    const needPass = (subscriptionTypeValue === 'monthly');

    const trainerId = document.getElementById('Trainer').value; // Assuming this is how you get the trainer ID

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const formDataAuthorization = {
        firstName: firstName,
        lastName: lastName,
        email: emailInput,
        phone: phoneInput,
        dogId: userId,
        dogName: dogNameSelect,
        breed: breedInput,
        trainerId: parseInt(trainerId), // Convert trainerId to integer if necessary
        passId: null, // Assuming you'll retrieve this value elsewhere
        needPass: needPass,
        times: [],
        price: 10
    };

    processTableRows(listTable, formDataAuthorization);

    fetch('http://localhost:8080/api/reserve/training', {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataAuthorization)
    })
        .then(r => {
            console.log('Reservation successful');
            // Reload the page after successful reservation
            location.reload(); // or window.location.reload();

            // Scroll to the top of the page
            window.scrollTo(0, 0);
        })
        .catch(e => {
            console.error('Error during reservation:', e);
        });
});

function processTableRows(listTable, formDataAuthorization) {
    listTable.querySelectorAll('tr').forEach(row => {
        const monthName = row.querySelector('.monthCell').textContent;
        const dayNumber = row.querySelector('.dayNumberCell').textContent;
        const year = row.querySelector('.yearCell').textContent;
        const selectedHour = row.querySelector('.hourCell').textContent;

        const selectedDate = new Date(`${monthName} ${dayNumber}, ${year} ${selectedHour}`);

        const formattedDate = formatISODate(selectedDate);

        formDataAuthorization.times.push({
            id: null,
            time: formattedDate
        });
    });
}



