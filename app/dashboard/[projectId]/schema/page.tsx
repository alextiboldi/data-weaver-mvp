"use client";
import SchemaViewer from "@/components/pages/project/SchemaViewer";
import { prisma } from "@/lib/prisma";
import useStore from "@/store/app-store";

import { notFound } from "next/navigation";

export default async function SchemaPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { selectedProject } = useStore();
  console.log("SelectedProject", selectedProject);
  return selectedProject ? (
    <SchemaViewer project={selectedProject} />
  ) : (
    <div>Loading...</div>
  );
}
