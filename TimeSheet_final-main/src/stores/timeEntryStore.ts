import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TimeEntry = {
  id: string;
  startTime: Date;
  endTime?: Date;
  type: "work" | "absence";
  activity: string;
  projectId: string;
  category: string;
  comment: string;
  externalComment: string;
  pauses: { start: Date; end?: Date; comment?: string }[];
  totalDuration?: number;
  adjustedDuration?: number;
};

type TimeEntryStore = {
  currentEntry: TimeEntry | null;
  entries: TimeEntry[];
  startEntry: (entry: Omit<TimeEntry, "id" | "startTime" | "pauses">) => void;
  pauseEntry: (comment?: string) => void;
  resumeEntry: () => void;
  stopEntry: (adjustedDuration?: number) => void;
  updateEntryComment: (comment: string) => void;
  updateEntry: (id: string, updates: Partial<TimeEntry>) => void;
  deleteEntry: (id: string) => void;
};

export const useTimeEntryStore = create<TimeEntryStore>(
  persist(
    (set, get) => ({
      currentEntry: null,
      entries: [],
      startEntry: (entry) => {
        const newEntry: TimeEntry = {
          ...entry,
          id: crypto.randomUUID(),
          startTime: new Date(),
          pauses: [],
          comment: entry.comment || entry.externalComment, // Use provided comment or fallback to external
          externalComment: entry.externalComment,
        };
        set({ currentEntry: newEntry });
      },
      pauseEntry: (comment) => {
        const { currentEntry } = get();
        if (currentEntry) {
          const updatedEntry = {
            ...currentEntry,
            pauses: [...currentEntry.pauses, { start: new Date(), comment }],
          };
          set({ currentEntry: updatedEntry });
        }
      },
      resumeEntry: () => {
        const { currentEntry } = get();
        if (currentEntry && currentEntry.pauses.length > 0) {
          const updatedPauses = [...currentEntry.pauses];
          const lastPause = updatedPauses[updatedPauses.length - 1];
          if (!lastPause.end) {
            lastPause.end = new Date();
          }
          set({
            currentEntry: {
              ...currentEntry,
              pauses: updatedPauses,
            },
          });
        }
      },
      stopEntry: (adjustedDuration) => {
        const { currentEntry, entries } = get();
        if (currentEntry) {
          const endTime = new Date();
          const completedEntry = {
            ...currentEntry,
            endTime,
            adjustedDuration:
              adjustedDuration ||
              endTime.getTime() - currentEntry.startTime.getTime(),
            startTime: new Date(currentEntry.startTime),
            pauses: currentEntry.pauses.map((pause) => ({
              start: new Date(pause.start),
              end: pause.end ? new Date(pause.end) : undefined,
              comment: pause.comment,
            })),
          };
          set({
            entries: [...entries, completedEntry],
            currentEntry: null,
          });
        }
      },
      updateEntryComment: (comment) => {
        const { currentEntry } = get();
        if (currentEntry) {
          set({
            currentEntry: {
              ...currentEntry,
              comment, // Update the comment immediately
            },
          });
        }
      },
      updateEntry: (id, updates) => {
        const { entries } = get();
        set({
          entries: entries.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  ...updates,
                  startTime: new Date(entry.startTime),
                  endTime: entry.endTime ? new Date(entry.endTime) : undefined,
                  pauses: entry.pauses.map((pause) => ({
                    start: new Date(pause.start),
                    end: pause.end ? new Date(pause.end) : undefined,
                    comment: pause.comment,
                  })),
                }
              : entry,
          ),
        });
      },
      deleteEntry: (id) => {
        const { entries } = get();
        set({
          entries: entries.filter((entry) => entry.id !== id),
        });
      },
    }),
    {
      name: "timesheet-storage",
      serialize: (state) =>
        JSON.stringify(state, (key, value) => {
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }),
    },
  ),
);
