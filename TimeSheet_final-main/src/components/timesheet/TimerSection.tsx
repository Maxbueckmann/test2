import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Square, ChevronUp, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useTimeEntryStore } from "@/stores/timeEntryStore";
import { useConfigurationStore } from "@/stores/configurationStore";

interface TimerSectionProps {
  onStart?: () => void;
  onStop?: () => void;
}

const TimerSection = ({
  onStart = () => {},
  onStop = () => {},
}: TimerSectionProps) => {
  const [showStartModal, setShowStartModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [selectedType, setSelectedType] = useState<"work" | "absence">("work");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [projectId, setProjectId] = useState("");
  const [externalComment, setExternalComment] = useState("");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  const { currentEntry, startEntry, stopEntry, updateEntryComment } =
    useTimeEntryStore();
  const { projects } = useConfigurationStore();

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentEntry) {
      timer = setInterval(() => {
        const diff = Date.now() - new Date(currentEntry.startTime).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setElapsedTime(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentEntry]);

  const handleTypeChange = (value: "work" | "absence") => {
    if (currentEntry) return;
    setSelectedType(value);
    setSelectedActivity("");
    setSelectedCategory("");
    setProjectId("");
    setExternalComment("");
  };

  const handleActivityChange = (value: string) => {
    if (currentEntry) return;
    setSelectedActivity(value);

    const selectedProject = projects.find((p) =>
      p.activities.some((a) => a.activity === value),
    );
    const selectedActivityConfig = selectedProject?.activities.find(
      (a) => a.activity === value,
    );

    if (selectedActivityConfig) {
      setProjectId(selectedActivityConfig.projectId);
      setSelectedCategory(selectedActivityConfig.category);
      setExternalComment(selectedActivityConfig.externalComment);
    }
  };

  const handleTimerToggle = () => {
    if (!currentEntry) {
      if (!selectedActivity || !selectedCategory || !projectId) {
        alert("Please fill in all required fields");
        return;
      }
      setShowStartModal(true);
    }
  };

  const handleStartConfirm = () => {
    setShowStartModal(false);
    startEntry({
      type: selectedType,
      activity: selectedActivity,
      projectId,
      category: selectedCategory,
      comment: currentEntry?.comment || externalComment,
      externalComment,
    });
    onStart();
  };

  const handleStopClick = () => {
    if (currentEntry) {
      const diff = Date.now() - new Date(currentEntry.startTime).getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setHours(h.toString().padStart(2, "0"));
      setMinutes(m.toString().padStart(2, "0"));
      setSeconds(s.toString().padStart(2, "0"));
    }
    setShowStopModal(true);
  };

  const handleStopConfirm = () => {
    const totalMs =
      (parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds)) *
      1000;
    stopEntry(totalMs);
    setShowStopModal(false);
    setHours("00");
    setMinutes("00");
    setSeconds("00");
    onStop();
  };

  const handleTimeInputChange = (
    type: "hours" | "minutes" | "seconds",
    value: string,
  ) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    switch (type) {
      case "hours":
        if (numValue >= 0 && numValue < 24) {
          setHours(numValue.toString().padStart(2, "0"));
        }
        break;
      case "minutes":
      case "seconds":
        if (numValue >= 0 && numValue < 60) {
          type === "minutes"
            ? setMinutes(numValue.toString().padStart(2, "0"))
            : setSeconds(numValue.toString().padStart(2, "0"));
        }
        break;
    }
  };

  const adjustTime = (
    type: "hours" | "minutes" | "seconds",
    increment: boolean,
  ) => {
    const adjust = (value: string, max: number) => {
      let num = parseInt(value);
      if (increment) {
        num = (num + 1) % max;
      } else {
        num = (num - 1 + max) % max;
      }
      return num.toString().padStart(2, "0");
    };

    switch (type) {
      case "hours":
        setHours(adjust(hours, 24));
        break;
      case "minutes":
        setMinutes(adjust(minutes, 60));
        break;
      case "seconds":
        setSeconds(adjust(seconds, 60));
        break;
    }
  };

  return (
    <>
      <Card className="p-6 bg-card text-white w-full h-[320px] border border-border">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Bereich</Label>
              <Select
                value={selectedType}
                onValueChange={handleTypeChange}
                disabled={!!currentEntry}
              >
                <SelectTrigger className="w-full bg-secondary">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">
                    Arbeitszeit im Unternehmen
                  </SelectItem>
                  <SelectItem value="absence">Abwesenheit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Aktivität</Label>
              <Select
                value={selectedActivity}
                onValueChange={handleActivityChange}
                disabled={!!currentEntry}
              >
                <SelectTrigger className="w-full bg-secondary">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  {projects
                    .filter((project) =>
                      selectedType === "absence"
                        ? project.name === "Abwesenheit"
                        : project.name === "Arbeitszeit im Unternehmen",
                    )
                    .map((project) =>
                      project.activities.map((activity) => (
                        <SelectItem
                          key={activity.activity}
                          value={activity.activity}
                        >
                          {activity.activity}
                        </SelectItem>
                      )),
                    )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={selectedCategory}
                className="bg-secondary"
                disabled={true}
                placeholder="Category will be auto-filled"
              />
            </div>
          </div>

          {currentEntry ? (
            <div className="flex flex-col items-center justify-center pt-4">
              <div className="text-3xl font-mono text-[#4CAF50] mb-4">
                {elapsedTime}
              </div>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleStopClick}
                  className="w-48 h-16 text-lg bg-red-600 hover:bg-red-700"
                >
                  <Square className="mr-2 h-6 w-6" /> Stop
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-4 pt-8">
              <Button
                size="lg"
                onClick={handleTimerToggle}
                className="w-48 h-16 text-lg bg-primary hover:bg-primary/90"
                disabled={!selectedActivity}
              >
                <Play className="mr-2 h-6 w-6" /> Start Timer
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={showStartModal} onOpenChange={setShowStartModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What will you do?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Comment</Label>
              <Textarea
                value={currentEntry?.comment || externalComment}
                onChange={(e) => updateEntryComment(e.target.value)}
                className="min-h-[100px]"
                placeholder="Add comments about your work session..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStartConfirm}>Start Timer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showStopModal} onOpenChange={setShowStopModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What have you done?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Adjusted Duration</Label>
              <div className="flex justify-center items-center gap-2 mt-2 font-mono text-2xl text-[#4CAF50]">
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 text-[#4CAF50] hover:text-[#4CAF50] hover:bg-[#4CAF50]/10"
                    onClick={() => adjustTime("hours", true)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) =>
                      handleTimeInputChange("hours", e.target.value)
                    }
                    className="w-12 text-center bg-[#121212] rounded-md py-1 focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 text-[#4CAF50] hover:text-[#4CAF50] hover:bg-[#4CAF50]/10"
                    onClick={() => adjustTime("hours", false)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-[#4CAF50]">:</span>
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 text-[#4CAF50] hover:text-[#4CAF50] hover:bg-[#4CAF50]/10"
                    onClick={() => adjustTime("minutes", true)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <input
                    type="text"
                    value={minutes}
                    onChange={(e) =>
                      handleTimeInputChange("minutes", e.target.value)
                    }
                    className="w-12 text-center bg-[#121212] rounded-md py-1 focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 text-[#4CAF50] hover:text-[#4CAF50] hover:bg-[#4CAF50]/10"
                    onClick={() => adjustTime("minutes", false)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-[#4CAF50]">:</span>
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 text-[#4CAF50] hover:text-[#4CAF50] hover:bg-[#4CAF50]/10"
                    onClick={() => adjustTime("seconds", true)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <input
                    type="text"
                    value={seconds}
                    onChange={(e) =>
                      handleTimeInputChange("seconds", e.target.value)
                    }
                    className="w-12 text-center bg-[#121212] rounded-md py-1 focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 text-[#4CAF50] hover:text-[#4CAF50] hover:bg-[#4CAF50]/10"
                    onClick={() => adjustTime("seconds", false)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Label>Comment</Label>
              <Textarea
                value={currentEntry?.comment || ""}
                onChange={(e) => updateEntryComment(e.target.value)}
                className="min-h-[100px]"
                placeholder="Add final comments about your work session..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStopConfirm}>End Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TimerSection;
