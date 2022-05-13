let city = 'frankfurt';
let url = 'https://api.openweathermap.org/data/2.5/onecall?q=frankfurt&exclude=minutely,alerts&units=metric&appid=8423e60a5000bca50b7e3468a8cae03b'
fetch(url)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(err => console.error(err));