import React, { useEffect, useState } from 'react';
import './App.css';
import PropTypes from 'prop-types';

// Images
import searchIcon from './assets/search.png';
import sunIcon from './assets/sun.png';
import cloudIcon from './assets/cloud.jpg';
import drizzleIcon from './assets/drizzle.jpg';
import rainIcon from './assets/rain.jpg';
import windIcon from './assets/wind.png';
import snowIcon from './assets/snow.png';
import humidityIcon from './assets/humidity.png';

function WeatherDetails({ icon, temp, city, country, lat, lon, humidity, wind }) {
  return (
    <>
      <div className="Image">
        <img src={icon} alt="Weather Icon" />
      </div>

      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>

      <div className="cord">
        <div>
          <span>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span>Longitude</span>
          <span>{lon}</span>
        </div>
      </div>

      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="Humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>

        <div className="element">
          <img src={windIcon} alt="Wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind</div>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  const api_key = "cb88c8a7867f94ecb643835a76e88be6";

  const [icon, setIcon] = useState(sunIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [text, setText] = useState("Chennai");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const weatherIconMap = {
    "01d": sunIcon,
    "01n": sunIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon
  };

  const search = async () => {
    setLoading(true);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod === "404") {
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      // Set Data
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);

      const iconCode = data.weather[0].icon;
      setIcon(weatherIconMap[iconCode] || sunIcon);

      setCityNotFound(false);
    } catch (err) {
      console.log("Weather API Error: ", err);
    }

    setLoading(false);
  };

  const handleKeyEnter = (e) => {
    if (e.key === "Enter") search();
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          className="cityInput"
          placeholder="Search City"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyEnter}
        />
        <div className="search-icon">
          <img src={searchIcon} alt="Search" onClick={search} />
        </div>
      </div>

      {loading && <div className="Loading-message">Loading...</div>}
      {cityNotFound && <div className="city-not-found">City Not Found</div>}

      {!loading && !cityNotFound && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          lon={lon}
          humidity={humidity}
          wind={wind}
        />
      )}

      <p className="copyright">
        Designed by <span>PRADEEPAN</span>
      </p>
    </div>
  );
}

export default App;
