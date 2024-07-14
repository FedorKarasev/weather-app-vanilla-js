const APIkey = '5131f785595a7dbb2e5f721c00417bf6';

function debounce(func, ms) {
  let timerId;
  return function () {
    clearTimeout(timerId);
    timerId = setTimeout(() => func.apply(this, arguments), ms);
    console.log(timerId);
  };
}

async function search(event) {
  const cityName = event.target.value;
  const limit = 5;
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIkey}
`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);

  const ulElement = document.querySelector('ul');
  ulElement.innerHTML = '';

  for (let i = 0; i < data.length; i++) {
    const { name, country, lon, lat, state } = data[i];
    let stateText = '';
    if (state) stateText = `, ${state}`;
    ulElement.innerHTML += `<li data-lat='${lat}' data-lon='${lon}' data-name='${name}'>${name} <span>(${country} ${stateText})</span></li>`;
  }
}

async function getWeatherData(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`;

  const res = await fetch(url);
  const weatherData = await res.json();

  console.log(weatherData);

  const temp = Math.round(weatherData.main.temp);
  const city = weatherData.name;
  const windSpeed = Math.round(weatherData.wind.speed);
  const feelsLike = Math.round(weatherData.main.feels_like);
  const humidity = weatherData.main.humidity;
  const icon = weatherData.weather[0].icon;
  const description = weatherData.weather[0].description;
  return { temp, windSpeed, feelsLike, humidity, icon, description, city };
}

function showWeather(weatherData) {
  const { temp, windSpeed, feelsLike, humidity, icon, description, city } = weatherData;

  const ul = document.querySelector('ul');
  ul.innerHTML = '';

  const weatherEl = document.querySelector('#weather');
  weatherEl.style.display = 'block';

  const degreesEl = document.querySelector('#degrees');
  degreesEl.innerHTML = `${temp}<span>°C</span>`;

  const windEl = document.querySelector('#windEl');
  windEl.innerHTML = `${windSpeed} <span>m/s</span>`;

  const cityEl = document.querySelector('#city');
  cityEl.innerHTML = city;

  const feelsLikeEl = document.querySelector('#feelsLikeEl');
  feelsLikeEl.innerHTML = `${feelsLike} <span>°C</span>`;

  const humidityEl = document.querySelector('#humidityEl');
  humidityEl.innerHTML = `${humidity} <span>%</span>`;

  const iconEl = document.querySelector('#iconEl');
  iconEl.setAttribute('src', `https://openweathermap.org/img/wn/${icon}@2x.png`);

  const weatherDescriptionEl = document.querySelector('#weather-description');
  weatherDescriptionEl.innerHTML = description;

  document.querySelector('form').style.display = 'none';
}

const debouncedSearch = debounce(search, 600);

document.querySelector('input[type="text"]').addEventListener('keyup', debouncedSearch);

const formElement = document.querySelector('form');
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
});

document.body.querySelector('form').addEventListener('click', async (e) => {
  let target = e.target.closest('li');
  let { lat, lon } = target.dataset;

  let weatherData = await getWeatherData(lat, lon);
  showWeather(weatherData);

  localStorage.setItem('coords', JSON.stringify({ lat, lon }));
});

document.querySelector('#changeCity').addEventListener('click', (e) => {
  document.querySelector('#weather').style.display = 'none';
  document.querySelector('form').style.display = 'block';
});

document.addEventListener('DOMContentLoaded', async () => {
  if (localStorage.getItem('coords')) {
    const { lat, lon } = JSON.parse(localStorage.getItem('coords'));
    const weatherData = await getWeatherData(lat, lon);
    console.log(weatherData);
    showWeather(weatherData);
    document.querySelector('#weather').style.display = 'block';
    document.querySelector('form').style.display = 'none';
  }
});
