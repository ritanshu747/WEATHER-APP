import { useState } from "react";
import Spinner from './components/spinner/spinner'
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOnSearchChange = (searchData) => {
    setLoading(true); // Set loading to true when starting a new fetch

    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false); // Set loading to false regardless of success or failure
      });
  };

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {loading ? (
        <Spinner /> // Display the spinner when loading is true
      ) : (
        <>
          {currentWeather && <CurrentWeather data={currentWeather} />}
          {forecast && <Forecast data={forecast} />}
        </>
      )}
    </div>
  );
}

export default App;
