import { prisma } from "@/lib/prisma";

import React from "react";
import { redirect } from "next/navigation";
import AppInitializer from "@/components/app-initializer";
import {
  Column,
  Project,
  ProjectInfo,
  Query,
  Relationship,
  Table,
} from "@/lib/types";
type Props = {};

const DashboardPage = async (props: Props) => {
  const dbProjectInfo = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      shortDescription: true,
    },
    where: {
      ownerId: "cm7dk3t5r0000cy6vou7nf4b3",
    },
  });
  const projectInfo: ProjectInfo[] = dbProjectInfo.map((project) => {
    return {
      id: project.id,
      name: project.name,
      description: project.shortDescription ?? "No description available",
    };
  });

  const dbSelectedProject = await prisma.project.findFirst({
    where: {
      ownerId: "cm7dk3t5r0000cy6vou7nf4b3",
      isSelected: true,
    },
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
      queries: true,
    },
  });

  if (dbSelectedProject) {
    const selectedProject: Project = {
      id: dbSelectedProject.id,
      name: dbSelectedProject.name,
      shortDescription: dbSelectedProject.shortDescription || "",
      description: dbSelectedProject.description || "",
      dataSource: dbSelectedProject.dataSource,
      connectionConfig: dbSelectedProject.connectionConfig,
      selectedTables: dbSelectedProject.selectedTables,
      tables: dbSelectedProject.tables.map(
        (table: any): Table => ({
          id: table.id,
          name: table.name,
          columns: table.columns.map(
            (column: any): Column => ({
              id: column.id,
              name: column.name,
              type: column.type,
              isPrimaryKey: column.isPrimaryKey,
              comment: column.comment,
            })
          ),
          relationships: table.relationships.map(
            (relationship: any): Relationship => ({
              id: relationship.id,
              sourceTableId: relationship.sourceTableId,
              sourceColumn: relationship.sourceColumn,
              targetTableId: relationship.targetTableId,
              targetColumn: relationship.targetColumn,
            })
          ),
          reverseRels: [],
          // reverseRels: table.reverseRels.map(
          //   (relationship: any): Relationship => ({
          //     id: relationship.id,
          //     sourceTableId: relationship.sourceTableId,
          //     sourceColumn: relationship.sourceColumn,
          //     targetTableId: relationship.targetTableId,
          //     targetColumn: relationship.targetColumn,
          //   })
          // ),
          comment: table.comment,
        })
      ),
      queries: dbSelectedProject.queries.map(
        (query: any): Query => ({
          id: query.id,
          name: query.name,
          query: query.query,
        })
      ),
    };

    return (
      <AppInitializer
        availableProjects={projectInfo}
        selectedProject={selectedProject}
      />
    );
  } else {
    <div className="SERVER ERROR"></div>;
  }
};

export default DashboardPage;
