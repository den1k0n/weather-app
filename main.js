const startPreloader = () => {
    window.setTimeout(() => {document.querySelector('.preloader').style.display = 'none'; document.querySelector('.container').style.display = 'initial'}, 2000);
}

// window.onload = startPreloader;
// You didn't see anything
const
    defaultApiKey = '0c5e131ca9786828236c6fd421583751',
    testApiKey = '8423e60a5000bca50b7e3468a8cae03b';

// CACHE DOM
const
    container = document.querySelector('.container');
    input = container.querySelector('input'),
    searchBtn = document.getElementById('search'),
    currentTemp = document.getElementById('currentTemp'),
    feelsLike = document.getElementById('feelsLike'),
    cityName = document.getElementById('cityName'),
    desc = document.getElementById('description');

let
    lat,
    lon,
    cityOutput;

// API URL for city call
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// API URL for lat/lon call
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

const createUrl = (apiKey, city = 'undefined', lat = 'undefined', lon = 'undefined') => {
    if(city !== 'undefined') return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
}

// const showData = data => {
//     console.log(data);
//     cityName.textContent = cityOutput;
//     currentTemp.textContent = data.current.temp + ' °C';
//     feelsLike.textContent = data.current.feels_like + ' °C';
// }

const showData = data => {
    console.log(data);
    cityName.textContent = data.name;
    desc.textContent = data.weather[0].description;
    currentTemp.textContent = data.main.temp + ' °C';
    feelsLike.textContent = data.main.feels_like + ' °C';
}

const secondFetch = res => {
    cityOutput = res.name;
    console.log(res);
    lat = res.coord.lat;
    lon = res.coord.lon;
    fetch(createUrl(testApiKey, 'undefined', lat, lon))
    .then(response => response.json())
    .then(result => showData(result))
    .catch(err => console.log(err));
}

// const fetching = () => {
//     city = input.value;
//     fetch(createUrl(defaultApiKey, city))
//     .then(response => response.json())
//     .then(result => secondFetch(result))
//     .catch(err => console.log(err));
//     container.style.display = 'none';
//     document.querySelector('.preloader').style.display = 'initial';
//     startPreloader();
// }

const fetching = () => {
    city = input.value;
    fetch(createUrl(defaultApiKey, city))
    .then(response => response.json())
    .then(result => showData(result))
    .catch(err => console.log(err));


    container.style.display = 'none';
    document.querySelector('.preloader').style.display = 'initial';
    startPreloader();
}
searchBtn.addEventListener('click', fetching);
window.addEventListener('keydown', (ev) => {
    if(ev.key === 'Enter') fetching();
})

