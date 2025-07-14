const apiKey = "3e16c997db51b20a767cb8a042b15764"; // Replace with your actual API key

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  document.getElementById("loader").style.display = "block";
  document.getElementById("weatherResult").innerHTML = "";
  document.getElementById("forecast").innerHTML = "";

  fetch(url)
    .then(response => {
      document.getElementById("loader").style.display = "none";
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const weatherHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
        <p>🌡️ Temperature: ${data.main.temp}°C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬️ Wind: ${data.wind.speed} m/s</p>
      `;
      document.getElementById("weatherResult").innerHTML = weatherHTML;

      document.body.style.background = getBackground(data.weather[0].main);
      saveSearch(city);
      getForecast(city);
    })
    .catch(error => {
      document.getElementById("weatherResult").innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(forecastData => {
      let forecastHTML = "<h3>5-Day Forecast:</h3><div class='forecast-grid'>";
      for (let i = 0; i < forecastData.list.length; i += 8) {
        const f = forecastData.list[i];
        forecastHTML += `
          <div class="forecast-item">
            <p><strong>${new Date(f.dt_txt).toLocaleDateString()}</strong></p>
            <p>${f.weather[0].main}</p>
            <p>${f.main.temp}°C</p>
          </div>
        `;
      }
      forecastHTML += "</div>";
      document.getElementById("forecast").innerHTML = forecastHTML;
    });
}

function getBackground(type) {
  switch (type.toLowerCase()) {
    case "clear": return "#ffeaa7";
    case "clouds": return "#dfe6e9";
    case "rain": return "#74b9ff";
    case "snow": return "#f1f2f6";
    default: return "#f0f8ff";
  }
}

function saveSearch(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    showHistory();
  }
}

function showHistory() {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  const list = history.map(city => `<li onclick="getWeatherFromHistory('${city}')">${city}</li>`).join("");
  document.getElementById("historyList").innerHTML = list;
}

function getWeatherFromHistory(city) {
  document.getElementById("cityInput").value = city;
  getWeather();
}

// Initialize history on page load
showHistory();
