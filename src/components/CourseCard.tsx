import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Trees, Phone } from "lucide-react";
import { DiscGolfCourse } from "@/hooks/useDiscGolfCourses";
import { WeatherInfo } from "./WeatherInfo";
import { Link } from "react-router-dom";

interface CourseCardProps {
  course: DiscGolfCourse;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${distance}ft`;
    }
    return `${(distance / 1000).toFixed(1)}k ft`;
  };

  return (
    <Link to={`/course/${course.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {course.name}
            </CardTitle>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="w-3 h-3" />
              <span className="text-sm">
                {course.city}, {course.state}
              </span>
            </div>
          </div>
          {course.rating && (
            <div className="flex items-center gap-1 bg-accent px-2 py-1 rounded-md">
              <Star className="w-3 h-3 fill-white text-white" />
              <span className="text-sm font-medium text-white">
                {course.rating}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {course.holes} holes
          </Badge>
          {course.classification && (
            <Badge variant="outline" className="text-xs">
              {course.classification}
            </Badge>
          )}
          {course.par && (
            <Badge variant="outline" className="text-xs">
              Par {course.par}
            </Badge>
          )}
        </div>

        {course.length?.course_length && (
          <div className="text-sm text-muted-foreground">
            Course Length: {formatDistance(course.length.course_length)}
          </div>
        )}

        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        )}

        {course.latitude && course.longitude && (
          <div className="border-t pt-3">
            <WeatherInfo 
              latitude={course.latitude} 
              longitude={course.longitude} 
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {course.elevation && (
            <div className="flex items-center gap-1">
              <Trees className="w-3 h-3" />
              <span>{course.elevation}</span>
            </div>
          )}
          {course.contact_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{course.contact_info.phone}</span>
            </div>
          )}
        </div>

        {course.established && (
          <div className="text-xs text-muted-foreground">
            Established: {course.established}
          </div>
        )}
      </CardContent>
    </Card>
    </Link>
  );
};