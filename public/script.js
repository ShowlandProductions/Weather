// Add a global variable to track the unit (Celsius or Fahrenheit)
let unit = 'metric'; // metric for Celsius, imperial for Fahrenheit

function displayWeatherData(data) {
    const weatherDataDiv = document.getElementById('weatherData');
    weatherDataDiv.innerHTML = ''; // Clear previous content

    // Check if the API response has an error message
    if (data.cod && data.cod !== 200) {
        weatherDataDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    // Display current weather information
    const temperature = data.main.temp;
    const feelsLike = data.main.feels_like;
    const humidity = data.main.humidity;
    const weatherDescription = data.weather[0].description;
    const windSpeed = data.wind.speed;
    const pressure = data.main.pressure;
    const visibility = data.visibility;
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    const unitSymbol = unit === 'metric' ? '°C' : '°F';
    const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

    const weatherInfoHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p class="weather-info">Weather: ${weatherDescription}</p>
        <p class="weather-info">Temperature: ${temperature.toFixed(1)}${unitSymbol}</p>
        <p class="weather-info">Feels Like: ${feelsLike.toFixed(1)}${unitSymbol}</p>
        <p class="weather-info">Humidity: ${humidity}%</p>
        <p class="weather-info">Wind Speed: ${windSpeed.toFixed(1)} ${speedUnit}</p>
        <p class="weather-info">Pressure: ${pressure} hPa</p>
        <p class="weather-info">Visibility: ${visibility} meters</p>
        <p class="weather-info">Sunrise: ${sunriseTime}</p>
        <p class="weather-info">Sunset: ${sunsetTime}</p>
    `;

    weatherDataDiv.innerHTML = weatherInfoHTML;
}

function displayForecastData(forecastData) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = ''; // Clear previous content

    // Display 5-day weather forecast
    forecastData.list.forEach(item => {
        const { dt_txt, main, weather } = item;
        const date = new Date(dt_txt);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temperature = main.temp;
        const weatherDescription = weather[0].description;
        const weatherIcon = getWeatherIcon(weather[0].icon); // Use icon code for weather icon

        const forecastItemHTML = `
            <div class="forecast-item">
                <div>${dayOfWeek}</div>
                <div>${temperature.toFixed(1)}${unit === 'metric' ? '°C' : '°F'}</div>
                <div class="weather-icon">
                    <i class="fas fa-${weatherIcon}"></i>
                </div>
                <div>${weatherDescription}</div>
            </div>
        `;

        forecastContainer.insertAdjacentHTML('beforeend', forecastItemHTML);
    });
}

function getWeatherIcon(icon) {
    // Font Awesome icons mapping
    const icons = {
        '01d': 'sun',
        '01n': 'moon',
        '02d': 'cloud-sun',
        '02n': 'cloud-moon',
        '03d': 'cloud',
        '03n': 'cloud',
        '04d': 'cloud',
        '04n': 'cloud',
        '09d': 'cloud-showers-heavy',
        '09n': 'cloud-showers-heavy',
        '10d': 'cloud-sun-rain',
        '10n': 'cloud-moon-rain',
        '11d': 'bolt',
        '11n': 'bolt',
        '13d': 'snowflake',
        '13n': 'snowflake',
        '50d': 'smog',
        '50n': 'smog',
    };

    return icons[icon] || 'cloud';
}

document.getElementById('unitToggle').addEventListener('change', () => {
    // Toggle the unit between metric and imperial
    unit = unit === 'metric' ? 'imperial' : 'metric';

    // Fetch weather data and forecast again with the new unit
    getWeatherData();
});

function getUserLocation() {
    // ... (existing code)
}

document.getElementById('getWeatherBtn').addEventListener('click', () => {
    getWeatherData();
});

document.getElementById('getWeatherByLocationBtn').addEventListener('click', () => {
    getUserLocation();
});

function getWeatherData() {
    const city = document.getElementById('city').value;
    const apiKey = 'cec7059f687fbe1815cdd0d70f23d097'; // Replace with your actual API key

    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);

            // After displaying current weather data, fetch 5-day forecast
            const { coord } = data;
            if (coord) {
                const { lat, lon } = coord;
                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(forecastData => displayForecastData(forecastData))
                    .catch(error => {
                        console.error('Error fetching forecast data:', error);
                    });
            }
        })
        .catch(error => {
            const weatherDataDiv = document.getElementById('weatherData');
            weatherDataDiv.innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
            console.error('Error fetching weather data:', error);
        });
}

// ... (existing code)
