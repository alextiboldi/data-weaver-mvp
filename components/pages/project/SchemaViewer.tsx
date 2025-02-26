"use client";

import React, { useMemo } from "react";
import { Background, Edge, ReactFlow } from "@xyflow/react";
import { DatabaseSchemaNode } from "@/components/database-schema-node";
import "@xyflow/react/dist/style.css";
import { Project } from "@/lib/types";
import { TableContextMenu } from "./TableContextMenu";

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

// Define nodeTypes outside to ensure it's not recreated on every render
const getNodeTypes = (searchResults?: any[]) => ({
  databaseSchema: (props: any) => (
    <TableContextMenu
      onViewData={() => {
        // Handle table click
        const table = {
          id: props.id,
          name: props.data.label,
          columns: props.data.schema.map((s: any) => ({
            id: `${props.id}-${s.title}`,
            name: s.title,
            type: s.type,
            isPrimaryKey: false,
            comment: "",
          })),
          relationships: [],
          reverseRels: [],
          comment: "",
        };
        // Add your table click handler here if needed
      }}
    >
      <DatabaseSchemaNode {...props} searchResults={searchResults} />
    </TableContextMenu>
  ),
});

export default function SchemaViewer({
  project,
  searchResults,
}: {
  project: Project;
  searchResults?: any[];
}) {
  const { nodes, edges } = useMemo(
    () => createNodesAndEdges(project),
    [project]
  );

  console.log("Search Results: ", searchResults);

  return (
    <div className="h-full w-full">
      <ReactFlow
        defaultNodes={nodes}
        defaultEdges={edges}
        nodeTypes={useMemo(() => getNodeTypes(searchResults), [searchResults])} // Memoizing function call
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
