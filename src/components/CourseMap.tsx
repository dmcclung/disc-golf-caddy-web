import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Navigation } from "lucide-react";
import { DiscGolfCourse } from "@/hooks/useDiscGolfCourses";
import { CoursePresence, useUserPresence } from "@/hooks/useCoursePresence";
import { useAuth } from "@/hooks/useAuth";
import { AuthGate } from "./AuthGate";

interface CourseMapProps {
  course: DiscGolfCourse;
  activeUsers: CoursePresence[];
  userCount: number;
}

export const CourseMap = ({ course, activeUsers, userCount }: CourseMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { checkIn, checkOut, isCheckingIn, isCheckingOut } = useUserPresence(course.id);
  const { isAuthenticated } = useAuth();

  const handleCheckIn = () => {
    checkIn();
  };

  const handleCheckOut = () => {
    checkOut();
  };

  // Simple placeholder map - in a real implementation, you'd integrate with Google Maps or Leaflet
  useEffect(() => {
    if (mapRef.current && course.latitude && course.longitude) {
      // Prevent multiple console logs
      console.log("Map initialized for course:", course.name);
    }
  }, [course.id]); // Only depend on course.id, not full course object

  const mapContent = (
    <div className="space-y-4">
      {/* Map Placeholder */}
      <div
        ref={mapRef}
        className="w-full h-96 bg-muted rounded-lg border flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: import.meta.env.VITE_MAPBOX_TOKEN && course.latitude && course.longitude ? 
            `url(https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${course.longitude},${course.latitude},15,0/800x400@2x?access_token=${import.meta.env.VITE_MAPBOX_TOKEN})` :
            undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Course Center Marker */}
        {course.latitude && course.longitude && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
        )}
        
        {/* User Markers Overlay */}
        {activeUsers.map((user, index) => (
          <div
            key={user.id}
            className="absolute"
            style={{
              left: `${50 + (index - activeUsers.length / 2) * 10}%`,
              top: `${50 + (index % 2 === 0 ? -10 : 10)}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="bg-accent text-accent-foreground p-1 rounded-full shadow-md border-2 border-white">
              <Users className="w-4 h-4" />
            </div>
            {user.profiles && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {user.profiles.username || user.profiles.full_name || 'Player'}
                </Badge>
              </div>
            )}
          </div>
        ))}
        
        {!course.latitude && !course.longitude && (
          <div className="text-center text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Map location not available</p>
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {userCount} active player{userCount !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {isAuthenticated && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className="flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                {isCheckingIn ? 'Checking in...' : 'Check In'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheckOut}
                disabled={isCheckingOut}
                className="flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                {isCheckingOut ? 'Checking out...' : 'Check Out'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AuthGate
      feature="map"
      title="Interactive Course Map"
      description="See who's currently playing, check in to let others know you're here, and connect with fellow disc golfers in real-time."
    >
      {mapContent}
    </AuthGate>
  );
};