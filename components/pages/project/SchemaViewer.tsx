"use client";

import { Background, Edge, ReactFlow } from "@xyflow/react";
import { DatabaseSchemaNode } from "@/components/database-schema-node";
import "@xyflow/react/dist/style.css";
import { Project } from "@/lib/types";

// type ProjectWithRelations = Project & {
//   tables: Array<{
//     id: string;
//     tableName: string;
//     columns: Array<{
//       id: string;
//       name: string;
//       type: string;
//       isPrimaryKey: boolean;
//     }>;
//     relationships: Array<{
//       id: string;
//       sourceColumn: string;
//       targetTable: {
//         id: string;
//         tableName: string;
//       };
//       targetColumn: string;
//     }>;
//   }>;
// };

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

const DEFAULT_NODE_TYPES = {
  databaseSchema: DatabaseSchemaNode,
} as const;

export default function SchemaViewer({ 
  project,
  nodeTypes: customNodeTypes 
}: { 
  project: Project;
  nodeTypes?: Record<string, any>;
}) {
  const { nodes, edges } = createNodesAndEdges(project);
  const nodeTypes = React.useMemo(
    () => ({ ...DEFAULT_NODE_TYPES, ...customNodeTypes }),
    [customNodeTypes]
  );

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
