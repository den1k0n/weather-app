const startPreloader = () => {
    window.setTimeout(() => {
        document.querySelector('.preloader').style.display = 'none';
    }, 2000);
}
// You didn't see anything
const
    defaultApiKey = '0c5e131ca9786828236c6fd421583751',
    testApiKey = '8423e60a5000bca50b7e3468a8cae03b';
// API URL for city call
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// API URL for lat/lon call
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

const createUrl = (apiKey, city = 'undefined', lat = 'undefined', lon = 'undefined', units) => {
    if(city !== 'undefined') return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
}

// CACHE DOM
const
    searchBtn = document.getElementById('searchBtn'),
    units = document.getElementById('units'),
    container = document.getElementById('container'),
    cityOutput = document.getElementById('searchInput'),
    cityName = document.getElementById('cityName'),
    currentTemperature = document.getElementById('currentTemperature'),
    description = document.getElementById('description'),

    hourlyForecast = document.getElementById('hourlyForecast'),
    dailyForecast = document.getElementById('dailyForecast'),
    errorContainer = document.querySelector('.error-container');

let measurement_units = 'metric';

const showData = data => {

    window.setTimeout( () => {
        if(data.cod % 100 == 4 || data.cod % 100 == 5) {
            window.setTimeout( () => {
                errorContainer.style.display = 'initial';
                errorContainer.textContent = data.message; 
            }, 2000);
            return;
        } else {
            container.style.display = 'flex'; errorContainer.style.display = 'none';
        }
    }, 2000)

    cityName.textContent = data.name;
    currentTemperature.textContent = Math.round(data.main.temp);
    description.textContent = data.weather[0].description;

    let lat = data.coord.lat,
        lon = data.coord.lon;
    
    fetch(createUrl(testApiKey, 'undefined', lat, lon, measurement_units))
    .then(response => response.json())
    .then(result => {
        // Hourly forecast
        let currentTime = new Date().getHours();
        for(let i = 0; i < 24; i++) {
            // I have no intentions to make it right
            // don't like the code - don't read it
            let temp = currentTime;
            if( (currentTime + i) >= 48 ) temp -= 24;
            else if( (currentTime + i) >= 24) temp -= 24;
            let newTime = (temp + i) % 12;
            if(newTime === 0) newTime = 12;
            if( Math.floor((currentTime + i) / 12) % 2 === 1 ) hourlyForecast.children[i].children[0].textContent = newTime + 'pm';
            else hourlyForecast.children[i].children[0].textContent = newTime + 'am';
            if(i === 0) hourlyForecast.children[i].children[0].textContent = 'Now';
            // ugh..
            hourlyForecast.children[i].children[1].setAttribute('src', `icons/${result.hourly[i].weather[0].icon}.svg`);
            hourlyForecast.children[i].children[2].textContent = Math.floor(result.hourly[i].temp) + '??';
        }

        // Daily forecast
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        currentTime = new Date().getDay();
        for(let i  = 0; i < 8; i++) {
            dailyForecast.children[i].children[0].textContent = days[(currentTime + i) % 7];
            if(i === 0) {
                dailyForecast.children[i].children[0].style.textDecoration = 'underline';
                dailyForecast.children[i].children[0].textContent = 'Today';
            }
            dailyForecast.children[i].children[1].setAttribute('src', `icons/${result.daily[i].weather[0].icon}.svg`);
            dailyForecast.children[i].children[2].textContent = Math.round(result.daily[i].temp.eve) + '??';
        }
    })
    .catch(err => console.error(err));
}

const fetching = () => {
    fetch(createUrl(defaultApiKey, cityOutput.value, 'undefined', 'undefined', measurement_units))
    .then(response => response.json())
    .then(result => showData(result))
    .catch(err => console.error(err));

    container.style.display = 'none';
    document.querySelector('.preloader').style.display = "initial";
    startPreloader();
}

units.addEventListener('click', () => {
    if(units.textContent === 'C') {
        units.textContent = 'F';
        measurement_units = 'imperial'
    } else {
        units.textContent = 'C';
        measurement_units = 'metric'
    }
})
searchBtn.addEventListener('click', fetching);
window.addEventListener('keydown', (ev) => {
    if(ev.key === 'Enter') fetching();
})

