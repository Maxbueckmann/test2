import React from "react";
import Sidebar from "./timesheet/Sidebar";
import TimerSection from "./timesheet/TimerSection";
import ActiveSession from "./timesheet/ActiveSession";
import WeeklyOverview from "./timesheet/WeeklyOverview";
import ConfigurationSection from "./timesheet/ConfigurationSection";
import { useTimeEntryStore } from "@/stores/timeEntryStore";

interface HomeProps {
  initialSection?: "timesheet" | "config";
}

const Home = ({ initialSection = "timesheet" }: HomeProps) => {
  const [activeSection, setActiveSection] = React.useState(initialSection);
  const currentEntry = useTimeEntryStore((state) => state.currentEntry);
  const updateEntryComment = useTimeEntryStore(
    (state) => state.updateEntryComment,
  );
  const pauseEntry = useTimeEntryStore((state) => state.pauseEntry);
  const resumeEntry = useTimeEntryStore((state) => state.resumeEntry);
  const stopEntry = useTimeEntryStore((state) => state.stopEntry);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-[1232px] mx-auto space-y-6">
          {activeSection === "timesheet" ? (
            <>
              <TimerSection />

              {currentEntry && (
                <ActiveSession
                  activity={currentEntry.activity}
                  projectId={currentEntry.projectId}
                  category={currentEntry.category}
                  startTime={currentEntry.startTime}
                  isRunning={
                    !currentEntry.pauses.length ||
                    !!currentEntry.pauses[currentEntry.pauses.length - 1].end
                  }
                  comment={currentEntry.comment}
                  onPauseResume={() => {
                    if (
                      currentEntry.pauses.length &&
                      !currentEntry.pauses[currentEntry.pauses.length - 1].end
                    ) {
                      resumeEntry();
                    } else {
                      pauseEntry();
                    }
                  }}
                  onStop={() => stopEntry("", null)}
                  onCommentChange={updateEntryComment}
                />
              )}

              <WeeklyOverview />
            </>
          ) : (
            <ConfigurationSection />
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
