import { Project } from "@/lib/types";
import { create } from "zustand";
import { ProjectInfo } from "@/lib/types";
import { persist, PersistOptions } from "zustand/middleware";

type Store = {
  availableProjects: ProjectInfo[];
  setAvailableProjects: (projects: ProjectInfo[]) => void;
  selectedProject?: Project;
  setSelectedProject: (project: Project) => void;

  selectedTable?: string;
  setSelectedTable: (table: string) => void;

  tableDetailDrawerOpen: boolean;
  setTableDetailDrawerOpen: (open: boolean) => void;
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
      selectedTable: "",
      setSelectedTable: (table) => {
        set({ selectedTable: table });
      },
      tableDetailDrawerOpen: false,
      setTableDetailDrawerOpen: (open) => {
        set({ tableDetailDrawerOpen: open });
      },
    }),
    {
      name: "app-store", // unique name
    }
  )
);

export default useStore;
