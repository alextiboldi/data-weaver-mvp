"use client";

import { NewProjectWizard } from "@/components/NewProjectWizard";
import AppInitializer from "@/components/app-initializer";
import {
  Project,
  ProjectInfo,
  Column,
  Query,
  Relationship,
  Table,
} from "@/lib/types";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    projectInfo: ProjectInfo[];
    selectedProject: Project | null;
  }>({ projectInfo: [], selectedProject: null });

  useEffect(() => {
    fetch("/api/projects/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (!data.dbSelectedProject) {
          setData({ projectInfo: [], selectedProject: null });
          setLoading(false);
          return;
        }

        const projectInfo = data.dbProjectInfo.map((project: any) => ({
          id: project.id,
          name: project.name,
          description: project.shortDescription ?? "No description available",
        }));

        const selectedProject: Project = {
          id: data.dbSelectedProject.id,
          name: data.dbSelectedProject.name,
          shortDescription: data.dbSelectedProject.shortDescription || "",
          description: data.dbSelectedProject.description || "",
          dataSource: data.dbSelectedProject.dataSource,
          connectionConfig: data.dbSelectedProject.connectionConfig,
          selectedTables: data.dbSelectedProject.selectedTables,
          tables: data.dbSelectedProject.tables.map(
            (table: any): Table => ({
              id: table.id,
              name: table.name,
              synonym: table.synonym,
              description: table.description,
              columns: table.columns.map(
                (column: any): Column => ({
                  id: column.id,
                  name: column.name,
                  synonym: column.synonym,
                  description: column.description,
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
              comment: table.comment,
            })
          ),
          queries: data.dbSelectedProject.queries.map(
            (query: any): Query => ({
              id: query.id,
              name: query.name,
              query: query.query,
            })
          ),
        };

        setData({ projectInfo, selectedProject });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data.selectedProject) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <NewProjectWizard />
      </div>
    );
  }

  return (
    <AppInitializer
      availableProjects={data.projectInfo}
      selectedProject={data.selectedProject}
    />
  );
}
