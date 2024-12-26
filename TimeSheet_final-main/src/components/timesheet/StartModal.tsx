import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface StartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (comment: string) => void;
  activity: string;
  projectId: string;
  category: string;
}

export const StartModal = ({
  open,
  onOpenChange,
  onConfirm,
  activity,
  projectId,
  category,
}: StartModalProps) => {
  const [comment, setComment] = React.useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-white">Start Time Tracking</DialogTitle>
        </DialogHeader>
        <div className="text-white space-y-4">
          <div className="space-y-2 p-3 bg-[#2A2A2A] rounded-md">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Activity:</span>
                <span>{activity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Project:</span>
                <span>{projectId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span>{category}</span>
              </div>
            </div>
          </div>
          <Textarea
            placeholder="Add initial comments about your work session..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-secondary border-none resize-none min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => onConfirm(comment)}
            className="bg-primary hover:bg-primary/90 w-full"
          >
            Start Timer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
