import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useTimeEntryStore } from "@/stores/timeEntryStore";
import { formatDuration } from "@/lib/timesheet";

const WeeklyOverview = () => {
  const entries = useTimeEntryStore((state) => state.entries);
  const updateEntry = useTimeEntryStore((state) => state.updateEntry);
  const deleteEntry = useTimeEntryStore((state) => state.deleteEntry);
  const [selectedEntry, setSelectedEntry] = React.useState(null);
  const [entryToDelete, setEntryToDelete] = React.useState(null);
  const [editedTime, setEditedTime] = React.useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [editedComment, setEditedComment] = React.useState("");
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  const dailyTotals = React.useMemo(() => {
    const totals = { Mo: 0, Di: 0, Mi: 0, Do: 0, Fr: 0, Sa: 0, So: 0 };
    entries.forEach((entry) => {
      const day = new Date(entry.startTime).toLocaleDateString("de-DE", {
        weekday: "short",
      });
      if (entry.adjustedDuration) {
        totals[day] = (totals[day] || 0) + entry.adjustedDuration;
      }
    });
    return totals;
  }, [entries]);

  const handleTimeClick = (entry) => {
    setSelectedEntry(entry);
    if (entry.adjustedDuration) {
      const hours = Math.floor(entry.adjustedDuration / (1000 * 60 * 60));
      const minutes = Math.floor(
        (entry.adjustedDuration % (1000 * 60 * 60)) / (1000 * 60),
      );
      const seconds = Math.floor((entry.adjustedDuration % (1000 * 60)) / 1000);
      setEditedTime({
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    }
    setEditedComment(entry.comment || "");
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (selectedEntry) {
      const totalMs =
        (parseInt(editedTime.hours) * 60 * 60 +
          parseInt(editedTime.minutes) * 60 +
          parseInt(editedTime.seconds)) *
        1000;
      updateEntry(selectedEntry.id, {
        adjustedDuration: totalMs,
        comment: editedComment,
      });
      setShowEditDialog(false);
    }
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
          setEditedTime({
            ...editedTime,
            hours: numValue.toString().padStart(2, "0"),
          });
        }
        break;
      case "minutes":
      case "seconds":
        if (numValue >= 0 && numValue < 60) {
          setEditedTime({
            ...editedTime,
            [type]: numValue.toString().padStart(2, "0"),
          });
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
        setEditedTime({
          ...editedTime,
          hours: adjust(editedTime.hours, 24),
        });
        break;
      case "minutes":
        setEditedTime({
          ...editedTime,
          minutes: adjust(editedTime.minutes, 60),
        });
        break;
      case "seconds":
        setEditedTime({
          ...editedTime,
          seconds: adjust(editedTime.seconds, 60),
        });
        break;
    }
  };

  return (
    <Card className="p-6 bg-background text-white border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[300px]">Aktivität</TableHead>
            <TableHead className="min-w-[120px]">Project ID</TableHead>
            <TableHead className="min-w-[300px]">Category</TableHead>
            <TableHead>Mo</TableHead>
            <TableHead>Di</TableHead>
            <TableHead>Mi</TableHead>
            <TableHead>Do</TableHead>
            <TableHead>Fr</TableHead>
            <TableHead>Sa</TableHead>
            <TableHead>So</TableHead>
            <TableHead className="w-[50px]">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.activity}</TableCell>
              <TableCell>{entry.projectId}</TableCell>
              <TableCell>{entry.category}</TableCell>
              {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
                <TableCell
                  key={day}
                  className="cursor-pointer hover:bg-secondary/50"
                  onClick={() => {
                    if (
                      new Date(entry.startTime).toLocaleDateString("de-DE", {
                        weekday: "short",
                      }) === day
                    ) {
                      handleTimeClick(entry);
                    }
                  }}
                >
                  {new Date(entry.startTime).toLocaleDateString("de-DE", {
                    weekday: "short",
                  }) === day && entry.adjustedDuration
                    ? formatDuration(entry.adjustedDuration)
                    : ""}
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-600/10"
                  onClick={() => setEntryToDelete(entry)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} className="font-medium">
              Total
            </TableCell>
            {Object.values(dailyTotals).map((total, index) => (
              <TableCell key={index}>{formatDuration(total)}</TableCell>
            ))}
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activity:</span>
                    <span>{selectedEntry.activity}</span>
                  </div>
                </div>
              </div>

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
                      value={editedTime.hours}
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
                      value={editedTime.minutes}
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
                      value={editedTime.seconds}
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
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!entryToDelete}
        onOpenChange={() => setEntryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Time Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this time entry? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (entryToDelete) {
                  deleteEntry(entryToDelete.id);
                  setEntryToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default WeeklyOverview;
