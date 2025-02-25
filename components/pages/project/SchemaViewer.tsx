"use client";

import React, { useMemo } from "react";
import { Background, Edge, ReactFlow } from "@xyflow/react";
import { DatabaseSchemaNode } from "@/components/database-schema-node";
import "@xyflow/react/dist/style.css";
import { Project } from "@/lib/types";

function createNodesAndEdges(project: Project) {
  const nodes = project.tables.map((table, index) => ({
    id: table.id,
    position: { x: index * 350, y: index % 2 === 0 ? 0 : 200 },
    type: "databaseSchema" as const,
    data: {
      label: table.name,
      schema: table.columns.map((column) => ({
        title: column.name,
        type: column.type,
      })),
    },
  }));

  const edges: Edge[] = project.tables.flatMap((table) =>
    table.relationships.map((rel) => ({
      id: rel.id,
      source: table.id,
      target: rel.targetTableId,
      sourceHandle: rel.sourceColumn,
      targetHandle: rel.targetColumn,
    }))
  );

  return { nodes, edges };
}

export default function SchemaViewer({ project, searchResults }: { project: Project, searchResults?: any[] }) {
  const { nodes, edges } = useMemo(() => createNodesAndEdges(project), [project]);

  const nodeTypes = useMemo(() => ({
    databaseSchema: (props: any) => (
      <DatabaseSchemaNode {...props} searchResults={searchResults} />
    ),
  }), [searchResults]);

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