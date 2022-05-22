const startPreloader = () => {
    window.setTimeout(() => {document.querySelector('.preloader').style.display = 'none';}, 2000);
}
// You didn't see anything
const
    defaultApiKey = '0c5e131ca9786828236c6fd421583751',
    testApiKey = '8423e60a5000bca50b7e3468a8cae03b';
// API URL for city call
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// API URL for lat/lon call
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

const createUrl = (apiKey, city = 'undefined', lat = 'undefined', lon = 'undefined') => {
    if(city !== 'undefined') return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
}

// CACHE DOM
const container = document.getElementById('container');
const cityOutput = document.getElementById('searchInput');
const cityName = document.getElementById('cityName');
const currentTemperature = document.getElementById('currentTemperature');
const description = document.getElementById('description');

const hourlyForecast = document.getElementById('hourlyForecast');
const dailyForecast = document.getElementById('dailyForecast');
const errorContainer = document.querySelector('.error-container');
const showData = data => {
    if(data.cod % 100 == 4 || data.cod % 100 == 5) {
        window.setTimeout( () => {
            errorContainer.style.display = 'initial';
            errorContainer.textContent = data.message; 
        }, 2000);
        return;
    }
    window.setTimeout( () => {container.style.display = 'flex'; errorContainer.style.display = 'none';},2000);
    cityName.textContent = data.name;
    currentTemperature.textContent = Math.round(data.main.temp);
    description.textContent = data.weather[0].description;

    let lat = data.coord.lat;
    let lon = data.coord.lon;
    fetch(createUrl(testApiKey, 'undefined', lat, lon))
    .then(response => response.json())
    .then(result => {
        console.log(result);
        console.log(hourlyForecast.children[0]);

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
            hourlyForecast.children[i].children[2].textContent = Math.floor(result.hourly[i].temp) + '°';
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
            dailyForecast.children[i].children[2].textContent = Math.round(result.daily[i].temp.eve) + '°';
        }
    })
    .catch(err => console.error(err));
}

const fetching = () => {
    let city = cityOutput.value;
    fetch(createUrl(defaultApiKey, city))
    .then(response => response.json())
    .then(result => showData(result))
    .catch(err => console.error(err));

    container.style.display = 'none';
    document.querySelector('.preloader').style.display = "initial";
    startPreloader();
}

searchBtn.addEventListener('click', fetching);
window.addEventListener('keydown', (ev) => {
    if(ev.key === 'Enter') fetching();
})

