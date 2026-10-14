import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CourseFiltersState {
  radius: number;
  courseType: string[];
  difficulty: string;
  amenities: string[];
}

interface CourseFiltersProps {
  filters: CourseFiltersState;
  onFiltersChange: (filters: CourseFiltersState) => void;
}

const RADIUS_OPTIONS = [
  { value: 5, label: "5 miles" },
  { value: 10, label: "10 miles" },
  { value: 25, label: "25 miles" },
  { value: 50, label: "50 miles" },
  { value: 100, label: "100 miles" },
];

const COURSE_TYPES = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "pay-to-play", label: "Pay-to-play" },
];

const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "professional", label: "Professional" },
];

const AMENITIES = [
  { value: "restrooms", label: "Restrooms" },
  { value: "parking", label: "Parking" },
  { value: "pro_shop", label: "Pro Shop" },
  { value: "food_service", label: "Food Service" },
  { value: "cart_rental", label: "Cart Rental" },
  { value: "disc_rental", label: "Disc Rental" },
];

export const CourseFilters = ({ filters, onFiltersChange }: CourseFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRadiusChange = (radius: string) => {
    onFiltersChange({ ...filters, radius: parseInt(radius) });
  };

  const handleCourseTypeChange = (courseType: string, checked: boolean) => {
    const newCourseTypes = checked
      ? [...filters.courseType, courseType]
      : filters.courseType.filter((type) => type !== courseType);
    onFiltersChange({ ...filters, courseType: newCourseTypes });
  };

  const handleDifficultyChange = (difficulty: string) => {
    onFiltersChange({ ...filters, difficulty });
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenity]
      : filters.amenities.filter((a) => a !== amenity);
    onFiltersChange({ ...filters, amenities: newAmenities });
  };

  const hasActiveFilters = filters.courseType.length > 0 || (filters.difficulty && filters.difficulty !== "any") || filters.amenities.length > 0;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Radius Filter - Always visible */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">Radius:</Label>
        <Select value={filters.radius.toString()} onValueChange={handleRadiusChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RADIUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty Filter - Always visible */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">Difficulty:</Label>
        <Select value={filters.difficulty || "any"} onValueChange={handleDifficultyChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {DIFFICULTY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* More Filters Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            More Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {filters.courseType.length + filters.amenities.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            {/* Course Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Course Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {COURSE_TYPES.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`course-type-${type.value}`}
                      checked={filters.courseType.includes(type.value)}
                      onCheckedChange={(checked) => handleCourseTypeChange(type.value, checked as boolean)}
                    />
                    <Label htmlFor={`course-type-${type.value}`} className="text-sm font-normal cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map((amenity) => (
                  <div key={amenity.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity.value}`}
                      checked={filters.amenities.includes(amenity.value)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity.value, checked as boolean)}
                    />
                    <Label htmlFor={`amenity-${amenity.value}`} className="text-sm font-normal cursor-pointer">
                      {amenity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="pt-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onFiltersChange({ 
                    ...filters, 
                    courseType: [], 
                    difficulty: "any", 
                    amenities: [] 
                  })}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};