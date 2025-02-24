"use client";

import { Background, Edge, ReactFlow } from "@xyflow/react";
import { DatabaseSchemaNode } from "@/components/database-schema-node";
import "@xyflow/react/dist/style.css";
import { Project } from "@prisma/client";

type ProjectWithRelations = Project & {
  tables: Array<{
    id: string;
    tableName: string;
    columns: Array<{
      id: string;
      name: string;
      type: string;
      isPrimaryKey: boolean;
    }>;
    relationships: Array<{
      id: string;
      sourceColumn: string;
      targetTable: {
        id: string;
        tableName: string;
      };
      targetColumn: string;
    }>;
  }>;
};

function createNodesAndEdges(project: ProjectWithRelations) {
  const nodes = project.tables.map((table, index) => ({
    id: table.id,
    position: { x: index * 350, y: index % 2 === 0 ? 0 : 200 },
    type: "databaseSchema" as const,
    data: {
      label: table.tableName,
      schema: table.columns.map(column => ({
        title: column.name,
        type: column.type,
      })),
    },
  }));

  const edges: Edge[] = project.tables.flatMap(table =>
    table.relationships.map(rel => ({
      id: rel.id,
      source: table.id,
      target: rel.targetTable.id,
      sourceHandle: rel.sourceColumn,
      targetHandle: rel.targetColumn,
    }))
  );

  return { nodes, edges };
}

const nodeTypes = {
  databaseSchema: DatabaseSchemaNode,
};

export default function SchemaViewer({ project }: { project: ProjectWithRelations }) {
  const { nodes, edges } = createNodesAndEdges(project);

  return (
    <div className="h-full w-full">
      <ReactFlow
        defaultNodes={nodes}
        defaultEdges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}