import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  precipitationProbability: number;
  humidity: number;
}

interface WeatherResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    relative_humidity_2m: number;
  };
  hourly: {
    precipitation_probability: number[];
  };
}

const getWeatherDescription = (code: number): { description: string; icon: string } => {
  if (code === 0) return { description: "Clear", icon: "☀️" };
  if (code <= 3) return { description: "Partly Cloudy", icon: "⛅" };
  if (code <= 48) return { description: "Foggy", icon: "🌫️" };
  if (code <= 57) return { description: "Drizzle", icon: "🌦️" };
  if (code <= 67) return { description: "Rain", icon: "🌧️" };
  if (code <= 77) return { description: "Snow", icon: "❄️" };
  if (code <= 82) return { description: "Showers", icon: "🌦️" };
  if (code <= 99) return { description: "Thunderstorm", icon: "⛈️" };
  return { description: "Unknown", icon: "🌡️" };
};

const getWindDirection = (degrees: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

const calculateFeelsLike = (temp: number, humidity: number, windSpeed: number): number => {
  // Simplified heat index/wind chill calculation
  if (temp >= 80) {
    // Heat index approximation
    const hi = temp + 0.5 * (humidity - 10);
    return Math.round(hi);
  } else if (temp <= 50) {
    // Wind chill approximation
    const wc = temp - (windSpeed * 0.7);
    return Math.round(wc);
  }
  return temp;
};

export const useWeather = (latitude: number, longitude: number) => {
  return useQuery({
    queryKey: ["weather", latitude, longitude],
    queryFn: async (): Promise<WeatherData & { description: string; icon: string; windDirectionText: string; feelsLike: number }> => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m&hourly=precipitation_probability&forecast_days=1&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const data: WeatherResponse = await response.json();
      const current = data.current;
      
      // Get max precipitation probability for next 3 hours
      const nextThreeHours = data.hourly.precipitation_probability.slice(0, 3);
      const maxPrecipitation = Math.max(...nextThreeHours);
      
      const weatherInfo = getWeatherDescription(current.weather_code);
      const windDirectionText = getWindDirection(current.wind_direction_10m);
      const feelsLike = calculateFeelsLike(
        current.temperature_2m,
        current.relative_humidity_2m,
        current.wind_speed_10m
      );
      
      return {
        temperature: Math.round((current.temperature_2m * 9/5) + 32), // Convert C to F
        weatherCode: current.weather_code,
        windSpeed: Math.round(current.wind_speed_10m * 0.621371), // Convert km/h to mph
        windDirection: current.wind_direction_10m,
        precipitationProbability: maxPrecipitation,
        humidity: current.relative_humidity_2m,
        description: weatherInfo.description,
        icon: weatherInfo.icon,
        windDirectionText: windDirectionText,
        feelsLike: Math.round(((current.temperature_2m * 9/5) + 32)), // Convert C to F
      };
    },
    enabled: !!(latitude && longitude),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};