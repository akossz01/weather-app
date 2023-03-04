const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const searchBox = document.querySelector('.search-box');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const cityNames = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia', 'Phoenix', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];

search.addEventListener('click', handler, false);

/* document.querySelector('.search-box').addEventListener('keydown', (event) => {
    if (event.keyCode !== 13) {
        //return console.log('Enter not pressed');
        return;
    }
    
    //console.log('Enter pressed');
    handler();
});

document.querySelector('.search-box').addEventListener('input', () => {
    // Get the current input text
    const inputText = searchBox.value.trim().toLowerCase();
    
    // Filter the city names for any matches to the input text
    const matchingCityNames = cityNames.filter(cityName => cityName.toLowerCase().startsWith(inputText));

    console.log(matchingCityNames);

    // Create a dropdown list element
    const dropdown = document.createElement('ul');
    dropdown.classList.add('dropdown');

    // Add a list item element for each matching city name
    matchingCityNames.forEach(cityName => {
    const listItem = document.createElement('li');
    listItem.textContent = cityName;
    
    // Add an event listener to each list item
    // When the user clicks on a list item, populate the search box with that name
    // and execute a search for weather data for that city
    listItem.addEventListener('click', () => {
        searchBox.value = cityName;
        executeSearch(cityName);
        dropdown.remove();
    });
    
    dropdown.appendChild(listItem);
    });
    const searchBoxRect = searchBox.getBoundingClientRect();
    dropdown.style.top = `${searchBoxRect.bottom}px`;
    dropdown.style.left = `${searchBoxRect.left}px`;

    document.body.appendChild(dropdown);
  }); */

function handler(event) {
    const APIKey = 'f34b9a94b07d1a842234259a4d379f61';
    const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const date = document.querySelector('.weather-box .date');
            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const city = document.querySelector('.weather-box .city');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');
            const sunrise = document.querySelector('.weather-details .sunrise span');
            const sunset = document.querySelector('.weather-details .sunset span');


            const dateUnix = new Date(json.sys.sunrise * 1000);
            const dateYear = dateUnix.getFullYear();
            const dateMonth = dateUnix.getUTCMonth();
            const dateDay = dateUnix.getUTCDay();

            //date.innerHTML = `${dateYear}.${addZero(dateMonth)}.${addZero(dateDay)}`;

            const sunriseTime = new Date(json.sys.sunrise * 1000);
            const sunriseHour = sunriseTime.getHours();
            const sunriseMin = sunriseTime.getMinutes();
            
            const sunsetTime = new Date(json.sys.sunset * 1000);
            const sunsetHour = sunsetTime.getHours();
            const sunsetMin = sunsetTime.getMinutes();

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'img/clear.png';
                    break;

                case 'Rain':
                    image.src = 'img/rain.png';
                    break;

                case 'Snow':
                    image.src = 'img/snow.png';
                    break;

                case 'Clouds':
                    image.src = 'img/cloud.png';
                    break;

                case 'Haze':
                    image.src = 'img/mist.png';
                    break;

                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            city.innerHTML = `${json.name}, ${json.sys.country}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)} km/h`;
            
            sunrise.innerHTML = `${addZero(sunriseHour)}:${addZero(sunriseMin)}`;
            sunset.innerHTML = `${addZero(sunsetHour)}:${addZero(sunsetMin)}`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '720px';

            animateValue(temperature, json.main.temp/2, json.main.temp, 800);
        });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start) + '°C';
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
}

// Fixing UNIX -> Date missing zeroes
function addZero(num){
    if (num < 10) {
        return '0' + num;
    } else {
        return num;
    }
}