// App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = "41ba0190f9554e53834135950240507"; // Your WeatherAPI.com API key

  // Fetch city suggestions from WeatherAPI.com as the user types
  const fetchSuggestions = (query) => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    fetch(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`)
      .then((response) => response.json())
      .then((data) => setSuggestions(data))
      .catch((error) => console.error("Error fetching suggestions:", error));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestedCity) => {
    setCity(suggestedCity);
    setSuggestions([]);
    handleSearch(suggestedCity); // Optionally trigger search for the selected suggestion
  };

  const handleSearch = (cityName) => {
    const searchCity = cityName || city; // Use the city parameter if provided, otherwise use state

    if (searchCity.trim() === "") {
      setError("Please enter a city name.");
      setWeatherData(null);
      return;
    }

    // Fetch weather data from WeatherAPI.com
    fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${searchCity}`
    )
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
          {/* <button className="search-button" onClick={() => handleSearch()}>
            Search
          </button> */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.name)}
                >
                  {suggestion.name}, {suggestion.region}, {suggestion.country}
                </li>
              ))}
            </ul>
          )}
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
