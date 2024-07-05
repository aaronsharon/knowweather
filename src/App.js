// App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = "41ba0190f9554e53834135950240507"; // Your WeatherAPI.com API key

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = () => {
    if (city.trim() === "") {
      setError("Please enter a city name.");
      setWeatherData(null);
      return;
    }

    // Fetch weather data from WeatherAPI.com
    fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("City not found. Please try again.");
        setWeatherData(null);
      });
  };

  return (
    <div className="main-component-sec">
      <section className="main-navbar-title">
        <h1>Know Weather API</h1>
        <h5>Get the latest weather updates, Aaron!</h5>
      </section>

      <section>
        <div className="main-input-sec">
          <input
            className="input-field"
            type="text"
            placeholder="Enter City Name"
            value={city}
            onChange={handleInputChange}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </section>

      <section>
        <div className="main-button-sec">
          {weatherData && (
            <div className="weather-info">
              <h2>{weatherData.location.name}</h2>
              <p>Temperature: {weatherData.current.temp_c} °C</p>
              <p>Description: {weatherData.current.condition.text}</p>
              <img
                src={weatherData.current.condition.icon}
                alt={weatherData.current.condition.text}
              />
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
        </div>
      </section>
    </div>
  );
}

export default App;
