import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { CourseMap } from "@/components/CourseMap";
import { CourseChat } from "@/components/CourseChat";
import { CourseConditions } from "@/components/CourseConditions";
import { CourseDetails } from "@/components/CourseDetails";
import { useDiscGolfCourse } from "@/hooks/useDiscGolfCourse";
import { useCoursePresence } from "@/hooks/useCoursePresence";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, MessageCircle } from "lucide-react";

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, isLoading: courseLoading } = useDiscGolfCourse(courseId);
  const { data: activeUsers, userCount } = useCoursePresence(courseId);

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Course not found</h1>
            <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Course Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{course.name}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{course.city}, {course.state}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{userCount} player{userCount !== 1 ? 's' : ''} at course</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Course Details & Map */}
            <div className="lg:col-span-2 space-y-6">
              <CourseDetails course={course} />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Interactive Course Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CourseMap 
                    course={course} 
                    activeUsers={activeUsers || []} 
                    userCount={userCount}
                  />
                </CardContent>
              </Card>

              {/* Course condition reports component renders its own structure */}
              <CourseConditions courseId={courseId!} />
            </div>

            {/* Right Column - Chat */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Course Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-96">
                    <CourseChat courseId={courseId!} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;