import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CloudRain, Sun, Snowflake, Droplets, CheckCircle, AlertTriangle, Plus } from "lucide-react";
import { useCourseConditions, ConditionType } from "@/hooks/useCourseConditions";
import { useAuth } from "@/hooks/useAuth";
import { AuthGate } from "./AuthGate";
import { formatDistanceToNow } from "date-fns";

interface CourseConditionsProps {
  courseId: string;
}

const CONDITION_CONFIG = {
  muddy: { icon: CloudRain, label: "Muddy", color: "bg-amber-500" },
  wet: { icon: Droplets, label: "Wet", color: "bg-blue-500" },
  dry: { icon: Sun, label: "Dry", color: "bg-yellow-500" },
  icy: { icon: Snowflake, label: "Icy", color: "bg-cyan-500" },
  well_maintained: { icon: CheckCircle, label: "Well Maintained", color: "bg-green-500" },
  needs_maintenance: { icon: AlertTriangle, label: "Needs Maintenance", color: "bg-red-500" },
};

export const CourseConditions = ({ courseId }: CourseConditionsProps) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<ConditionType | "">("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState([3]);
  const { user } = useAuth();

  const {
    data: conditions = [],
    reportCondition,
    isReporting,
    conditionSummary,
    isLoading,
  } = useCourseConditions(courseId);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCondition) return;

    try {
      await reportCondition({
        conditionType: selectedCondition as ConditionType,
        description: description || undefined,
        severity: severity[0],
      });

      // Reset form
      setSelectedCondition("");
      setDescription("");
      setSeverity([3]);
      setShowReportForm(false);
    } catch (error) {
      console.error("Failed to submit condition report:", error);
    }
  };

  const getConditionIcon = (condition: ConditionType) => {
    const Icon = CONDITION_CONFIG[condition].icon;
    return <Icon className="w-4 h-4" />;
  };

  const getConditionColor = (condition: ConditionType) => {
    return CONDITION_CONFIG[condition].color;
  };

  const conditionsContent = (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Course Conditions</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowReportForm(!showReportForm)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Report Condition
        </Button>
      </div>
      <div className="space-y-6">
          {/* Condition Summary */}
          {conditionSummary && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Recent Activity</h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{conditionSummary.totalReports} reports in last 24h</span>
                {conditionSummary.mostReported && (
                  <Badge variant="secondary">
                    Most reported: {CONDITION_CONFIG[conditionSummary.mostReported].label}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Report Form */}
          {showReportForm && (
            <div className="p-4 border rounded-lg">
              <form onSubmit={handleSubmitReport} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Condition Type
                    </label>
                    <Select
                      value={selectedCondition}
                      onValueChange={(value) => setSelectedCondition(value as ConditionType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CONDITION_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <config.icon className="w-4 h-4" />
                              {config.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Severity (1-5)
                    </label>
                    <Slider
                      value={severity}
                      onValueChange={setSeverity}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Mild</span>
                      <span>Severe</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Description (Optional)
                    </label>
                    <Textarea
                      placeholder="Additional details about the condition..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={!selectedCondition || isReporting}
                    >
                      {isReporting ? "Reporting..." : "Submit Report"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowReportForm(false);
                        setSelectedCondition("");
                        setDescription("");
                        setSeverity([3]);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
              </form>
            </div>
          )}

          {/* Recent Conditions */}
          <div className="space-y-3">
            <h4 className="font-medium">Recent Reports</h4>
            {isLoading ? (
              <div className="text-center text-muted-foreground py-8">
                Loading conditions...
              </div>
            ) : conditions && conditions.length > 0 ? (
              conditions.map((condition) => (
                <div key={condition.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full text-white ${getConditionColor(condition.condition_type as ConditionType)}`}>
                        {getConditionIcon(condition.condition_type as ConditionType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {CONDITION_CONFIG[condition.condition_type as ConditionType].label}
                          </span>
                          {condition.severity && (
                            <Badge variant="outline" className="text-xs">
                              Severity: {condition.severity}/5
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Reported by {condition.profiles?.username || condition.profiles?.full_name || 'Anonymous'} •{' '}
                          {formatDistanceToNow(new Date(condition.created_at || ''))} ago
                        </p>
                        {condition.description && (
                          <p className="text-sm text-muted-foreground">
                            {condition.description}
                          </p>
                        )}
                      </div>
                    </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No conditions reported yet. Be the first to help other players!
              </div>
            )}
          </div>
      </div>
    </div>
  );

  return (
    <AuthGate
      feature="conditions"
      title="Course Condition Reports"
      description="Stay informed about current course conditions and help other players by reporting what you find on the course."
    >
      {conditionsContent}
    </AuthGate>
  );
};