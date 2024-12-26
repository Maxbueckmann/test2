export type TimeEntry = {
  id: string;
  startTime: Date;
  endTime?: Date;
  type: "work" | "absence";
  activity: string;
  projectId: string;
  category: string;
  comment: string;
  initialComment?: string;
  finalComment?: string;
  pauses: { start: Date; end?: Date; comment?: string }[];
  totalDuration?: number;
  adjustedDuration?: number;
  externalComment?: string;
};

export const calculateTotalDuration = (entry: TimeEntry): number => {
  if (!entry.endTime) return 0;
  let total = entry.endTime.getTime() - entry.startTime.getTime();
  entry.pauses.forEach((pause) => {
    if (pause.end) {
      total -= pause.end.getTime() - pause.start.getTime();
    }
  });
  return total;
};

export const formatDuration = (ms: number): string => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};
