import { useState, useEffect } from "react";
import { CourseList } from "@/components/CourseList";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CourseFilters, CourseFiltersState } from "@/components/CourseFilters";
import { useGeolocation } from "@/hooks/useGeolocation";
import { SearchParams } from "@/hooks/useDiscGolfCourses";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

const Index = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    // Start with no lat/lon; CourseList will wait until we have them or user searches
    radius: 25,
  });
  const [filters, setFilters] = useState<CourseFiltersState>({
    radius: 25,
    courseType: [],
    difficulty: "",
    amenities: [],
  });

  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();

  // Auto-set location when geolocation is available
  useEffect(() => {
    if (latitude && longitude && !geoError) {
      setSearchParams(prev => ({
        ...prev,
        latitude,
        longitude,
      }));
    }
  }, [latitude, longitude, geoError]);

  const handleLocationSelect = (location: { lat: number; lon: number; name: string }) => {
    setSearchParams(prev => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lon,
    }));
  };

  const handleFiltersChange = (newFilters: CourseFiltersState) => {
    setFilters(newFilters);
    setSearchParams(prev => ({
      ...prev,
      radius: newFilters.radius,
      courseType: newFilters.courseType,
      difficulty: newFilters.difficulty,
      amenities: newFilters.amenities,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Discover your next round</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <SearchBar onLocationSelect={handleLocationSelect} />
              <CourseFilters filters={filters} onFiltersChange={handleFiltersChange} />
            </div>

            {geoLoading && (
              <Alert className="mb-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Getting your location…
                </AlertDescription>
              </Alert>
            )}

            {geoError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Location access denied. Use the search bar to find courses in your area.
                </AlertDescription>
              </Alert>
            )}

            <CourseList searchParams={searchParams} requireLocation />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;