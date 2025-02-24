
import SchemaViewer from "@/components/pages/project/SchemaViewer";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

async function getProject(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tables: {
        include: {
          columns: true,
          relationships: {
            include: {
              targetTable: true,
            },
          },
        },
      },
    },
  });
  
  if (!project) {
    notFound();
  }
  
  return project;
}

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await getProject(params.projectId);
  
  return <SchemaViewer project={project} />;
}
