import { Project } from "@/lib/types";
import { create } from "zustand";
import { ProjectInfo } from "@/lib/types";
import { persist, PersistOptions } from "zustand/middleware";

type Store = {
  availableProjects: ProjectInfo[];
  setAvailableProjects: (projects: ProjectInfo[]) => void;
  selectedProject?: Project;
  setSelectedProject: (project: Project) => void;
};

const useStore = create<Store>()(
  persist(
    (set) => ({
      availableProjects: [],
      setAvailableProjects: (projects) => {
        set({ availableProjects: projects });
      },
      selectedProject: undefined,
      setSelectedProject: (project) => {
        set({ selectedProject: project });
      },
    }),
    {
      name: "app-store", // unique name
    }
  )
);

export default useStore;
