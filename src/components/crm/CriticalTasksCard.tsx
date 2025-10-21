import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Calendar, Plus, Video } from "lucide-react";

const urgentTasks = [
  {
    title: "SEC comment letter response due",
    company: "GreenEnergy Corp",
    deadline: "2 days",
    priority: "urgent",
  },
  {
    title: "Final S-1 filing",
    company: "BioMed Solutions",
    deadline: "3 days",
    priority: "urgent",
  },
  {
    title: "Fairness opinion deadline",
    company: "TechCore",
    deadline: "4 days",
    priority: "urgent",
  },
];

const highPriorityTasks = [
  {
    title: "Due diligence session",
    company: "AI Robotics Co.",
    time: "Tomorrow, 9 AM",
    priority: "high",
  },
  {
    title: "Pricing committee meeting",
    company: "DataStream Inc.",
    time: "Feb 25, 2 PM",
    priority: "high",
  },
];

const upcomingMeetings = [
  {
    title: "Org meeting - FinTech IPO",
    time: "Today, 2:00 PM",
    duration: "2hr",
  },
  {
    title: "Management prep session",
    company: "TechVenture",
    time: "Tomorrow, 10 AM",
    duration: "3hr",
  },
  {
    title: "Pricing call",
    company: "DataCloud",
    time: "Feb 24, 4:00 PM",
    duration: "1hr",
  },
];

export const CriticalTasksCard = () => {
  return (
    <Card className="bg-card/70 border-border backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Critical Deadlines
            </CardTitle>
            <CardDescription>Next 7 days - Immediate attention required</CardDescription>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Urgent Tasks */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-destructive text-destructive-foreground">URGENT</Badge>
            <span className="text-sm text-muted-foreground">{urgentTasks.length} items</span>
          </div>
          <div className="space-y-2">
            {urgentTasks.map((task, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 hover:bg-destructive/15 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                      <h4 className="font-semibold text-sm text-foreground">{task.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">{task.company}</p>
                  </div>
                  <div className="flex items-center gap-1 text-destructive">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-medium">{task.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Priority */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-warning text-warning-foreground">HIGH PRIORITY</Badge>
            <span className="text-sm text-muted-foreground">{highPriorityTasks.length} items</span>
          </div>
          <div className="space-y-2">
            {highPriorityTasks.map((task, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-warning/10 border border-warning/20 hover:bg-warning/15 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-foreground mb-1">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.company}</p>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs font-medium">{task.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Video className="w-4 h-4" />
            Upcoming Meetings
          </h3>
          <div className="space-y-2">
            {upcomingMeetings.map((meeting, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card/70 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-foreground">{meeting.title}</h4>
                    {meeting.company && (
                      <p className="text-xs text-muted-foreground mt-0.5">{meeting.company}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{meeting.time}</div>
                    <div className="text-xs text-primary font-medium">{meeting.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
