import { useWeather } from "@/hooks/useWeather";
import { Wind, Droplets } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherInfoProps {
  latitude: number;
  longitude: number;
}

export const WeatherInfo = ({ latitude, longitude }: WeatherInfoProps) => {
  const { data: weather, isLoading, error } = useWeather(latitude, longitude);

  if (isLoading) {
    return (
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  const getWindStrength = (speed: number) => {
    if (speed < 5) return { label: "Light", color: "text-green-600" };
    if (speed < 15) return { label: "Moderate", color: "text-yellow-600" };
    return { label: "Strong", color: "text-red-600" };
  };

  const windStrength = getWindStrength(weather.windSpeed);

  return (
    <div className="space-y-1 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-lg">{weather.icon}</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">{weather.description}</span>
          <span className="font-semibold">{weather.temperature}°F</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3" />
          <span className={`font-medium ${windStrength.color}`}>
            {weather.windSpeed} mph {weather.windDirectionText}
          </span>
        </div>
        
        {weather.precipitationProbability > 0 && (
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            <span>{weather.precipitationProbability}% rain</span>
          </div>
        )}
      </div>
    </div>
  );
};