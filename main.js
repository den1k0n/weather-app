const doStuff = pos => console.log(pos);
const handleErr = err => console.log(err);

// You didn't see anything
const
    defaultApiKey = '0c5e131ca9786828236c6fd421583751',
    testApiKey = '8423e60a5000bca50b7e3468a8cae03b';


let city = 'frankfurt',
    lat,
    lon;

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
const createUrl = (apiKey, city = 'undefined', lat = 'undefined', lon = 'undefined') => {
    if(city !== 'undefined') return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
}

const showData = data => {
    console.log(data);
}

const secondFetch = res => {
    // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    console.log(lat, lon)
    fetch(createUrl(testApiKey, 'undefined', lat, lon))
    .then(response => response.json())
    .then(result => showData(result))
    .catch(err => console.log(err));
}

fetch(createUrl(defaultApiKey, city))
    .then(response => response.json())
    .then(result => secondFetch(result))
    .catch(err => console.log(err));
