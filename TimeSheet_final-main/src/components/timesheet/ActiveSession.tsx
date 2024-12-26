import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pause, Play, Square } from "lucide-react";

interface ActiveSessionProps {
  activity?: string;
  projectId?: string;
  category?: string;
  startTime?: Date;
  isRunning?: boolean;
  comment?: string;
  onPauseResume?: () => void;
  onStop?: () => void;
  onCommentChange?: (comment: string) => void;
}

const ActiveSession = ({
  activity = "Development",
  projectId = "PROJ-123",
  category = "Frontend",
  startTime = new Date(),
  isRunning = true,
  comment = "",
  onPauseResume = () => {},
  onStop = () => {},
  onCommentChange = () => {},
}: ActiveSessionProps) => {
  const [elapsedTime, setElapsedTime] = React.useState("00:00:00");

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (isRunning) {
        const diff = Date.now() - new Date(startTime).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setElapsedTime(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, startTime]);

  return (
    <Card className="w-full p-6 bg-background text-white border border-border">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-semibold">{activity}</h3>
              <span className="text-sm text-gray-400">
                Project: {projectId}
              </span>
              <span className="text-sm text-gray-400">
                Category: {category}
              </span>
            </div>
            <div className="text-3xl font-mono text-[#4CAF50]">
              {elapsedTime}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-[#4CAF50]/20 border-[#4CAF50]"
              onClick={onPauseResume}
            >
              {isRunning ? (
                <Pause className="h-4 w-4 text-[#4CAF50]" />
              ) : (
                <Play className="h-4 w-4 text-[#4CAF50]" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-red-500/20 border-red-500"
              onClick={onStop}
            >
              <Square className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        <Textarea
          placeholder="Add comments about your work session..."
          className="bg-[#2A2A2A] border-none resize-none"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
        />
      </div>
    </Card>
  );
};

export default ActiveSession;
