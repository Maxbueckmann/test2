import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ActivityConfig = {
  activity: string;
  projectId: string;
  category: string;
  externalComment: string;
};

type ProjectConfig = {
  projectId: string;
  name: string;
  activities: ActivityConfig[];
};

type ConfigurationStore = {
  projects: ProjectConfig[];
  addProject: (project: ProjectConfig) => void;
  removeProject: (projectId: string) => void;
  addActivity: (projectId: string, activity: ActivityConfig) => void;
  removeActivity: (projectId: string, activity: string) => void;
  updateActivity: (projectId: string, activity: ActivityConfig) => void;
};

// Default configuration based on the provided hierarchy
const defaultProjects: ProjectConfig[] = [
  {
    projectId: "890085",
    name: "Abwesenheit",
    activities: [
      {
        activity: "Uni Zeit",
        projectId: "890085",
        category: "H03147 - Other Paid Time off",
        externalComment: "studying at DHBW university",
      },
      {
        activity: "Krankheitstage",
        projectId: "890085",
        category: "H03128 - Sickness Leave",
        externalComment: "Sickness Leave",
      },
      {
        activity: "Urlaub",
        projectId: "890085",
        category: "H03118 - Holiday",
        externalComment: "Holiday",
      },
      {
        activity: "Feiertag",
        projectId: "890085",
        category: "H03003 - Time off - Paid absence / non-holiday",
        externalComment: "Bank holiday",
      },
      {
        activity: "Wellness Day",
        projectId: "890085",
        category: "H03003 - Time off - Paid absence / non-holiday",
        externalComment: "Wellness Day",
      },
    ],
  },
  {
    projectId: "890023",
    name: "Arbeitszeit im Unternehmen",
    activities: [
      {
        activity: "Ausbildungszeit im Unternehmen",
        projectId: "890023",
        category: "H03107 - Internal - Professional development and training",
        externalComment:
          "z. B. Tutorials, Lehrgänge, etc., die während der Arbeitszeit gemacht werden",
      },
      {
        activity: "Projektarbeit",
        projectId: "890023",
        category: "H03108 - Internal - Career development / mentoring",
        externalComment: "Projectarbeit",
      },
      {
        activity: "One2One Termine",
        projectId: "890023",
        category: "H03108 - Internal - Career development / mentoring",
        externalComment: "development, mentoring",
      },
      {
        activity: "Interne Meetings",
        projectId: "890023",
        category: "H03104 - Internal - Non-client / internal meeting",
        externalComment:
          "Munich Location Meeting, Merkle Germany Monthly Session, etc.",
      },
      {
        activity: "Interne Arbeit",
        projectId: "890023",
        category:
          "H03105 - Internal - Internal - Non-client operational activities",
        externalComment: "Internal Arbeit",
      },
    ],
  },
];

export const useConfigurationStore = create<ConfigurationStore>(
  persist(
    (set, get) => ({
      projects: defaultProjects,
      addProject: (project) => {
        const { projects } = get();
        if (!projects.find((p) => p.projectId === project.projectId)) {
          set({ projects: [...projects, project] });
        }
      },
      removeProject: (projectId) => {
        const { projects } = get();
        set({
          projects: projects.filter((p) => p.projectId !== projectId),
        });
      },
      addActivity: (projectId, activity) => {
        const { projects } = get();
        set({
          projects: projects.map((project) =>
            project.projectId === projectId
              ? {
                  ...project,
                  activities: [...project.activities, activity],
                }
              : project,
          ),
        });
      },
      removeActivity: (projectId, activityName) => {
        const { projects } = get();
        set({
          projects: projects.map((project) =>
            project.projectId === projectId
              ? {
                  ...project,
                  activities: project.activities.filter(
                    (a) => a.activity !== activityName,
                  ),
                }
              : project,
          ),
        });
      },
      updateActivity: (projectId, updatedActivity) => {
        const { projects } = get();
        set({
          projects: projects.map((project) =>
            project.projectId === projectId
              ? {
                  ...project,
                  activities: project.activities.map((activity) =>
                    activity.activity === updatedActivity.activity
                      ? updatedActivity
                      : activity,
                  ),
                }
              : project,
          ),
        });
      },
    }),
    {
      name: "timesheet-config",
    },
  ),
);
