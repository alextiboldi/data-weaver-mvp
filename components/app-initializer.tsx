"use client";

import { ProjectInfo, Project } from "@/lib/types";
import useStore from "@/store/app-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { Project as DBProject } from "@prisma/client";

export default function AppInitializer({
  availableProjects,
  selectedProject,
}: {
  availableProjects: ProjectInfo[] | null;
  selectedProject: Project | null;
}) {
  const router = useRouter();
  const { setAvailableProjects, setSelectedProject } = useStore();
  useEffect(() => {
    if (availableProjects === null || selectedProject === null) {
      console.log("App Initializer No availableProjects or selectedProject");
      return;
    } else {
      //map selectedProject to Project
      setAvailableProjects(availableProjects);
      setSelectedProject(selectedProject);

      console.log("AppInitializer invoked");
      router.push(`/dashboard/${selectedProject.id}`);
    }
  }, [availableProjects, selectedProject]);

  return null;
}
