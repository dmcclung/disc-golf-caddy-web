import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Target, Trees, Info, CloudRain } from "lucide-react";
import { DiscGolfCourse } from "@/hooks/useDiscGolfCourses";
import { WeatherInfo } from "@/components/WeatherInfo";

interface CourseDetailsProps {
  course: DiscGolfCourse;
}

export const CourseDetails = ({ course }: CourseDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Course Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Holes:</span>
            <span className="text-sm">{course.holes}</span>
          </div>
          
          {course.par && (
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Par:</span>
              <span className="text-sm">{course.par}</span>
            </div>
          )}
          
          {course.established && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Established:</span>
              <span className="text-sm">{course.established}</span>
            </div>
          )}
          
          {course.designer && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Designer:</span>
              <span className="text-sm">{course.designer}</span>
            </div>
          )}
          
          {course.classification && (
            <div className="flex items-center gap-2">
              <Trees className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Type:</span>
              <Badge variant="secondary">{course.classification}</Badge>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Location:</span>
            <span className="text-sm">{course.city}, {course.state}</span>
          </div>
        </div>

        {/* Inline weather section styled to match details */}
        <div className="rounded-md border bg-muted/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <CloudRain className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-medium">Current Weather</h4>
          </div>
          <WeatherInfo latitude={course.latitude as number} longitude={course.longitude as number} />
        </div>

        {course.description && (
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{course.description}</p>
          </div>
        )}
        
        {course.directions && (
          <div>
            <h4 className="text-sm font-medium mb-2">Directions</h4>
            <p className="text-sm text-muted-foreground">{course.directions}</p>
          </div>
        )}
        
        {course.services && (
          <div>
            <h4 className="text-sm font-medium mb-2">Amenities</h4>
            <p className="text-sm text-muted-foreground">{course.services}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};