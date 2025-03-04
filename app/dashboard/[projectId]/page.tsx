"use client";
import SchemaViewer from "@/components/pages/project/SchemaViewer";
import useStore from "@/store/app-store";

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { selectedProject } = useStore();

  return selectedProject ? (
    <SchemaViewer project={selectedProject} />
  ) : (
    <div>Loading...</div>
  );
}
