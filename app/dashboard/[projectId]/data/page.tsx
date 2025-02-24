
"use client";
import { useState } from "react";
import SchemaViewer from "@/components/pages/project/SchemaViewer";
import { TableContextMenu } from "@/components/pages/project/TableContextMenu";
import { TableDataViewer } from "@/components/pages/project/TableDataViewer";
import useStore from "@/store/app-store";
import { Table } from "@/lib/types";

export default function DataPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { selectedProject } = useStore();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);

  const handleTableClick = async (table: Table) => {
    setSelectedTable(table);
    // Here you would fetch the actual data from your API
    // This is a placeholder that creates mock data
    const mockData = Array.from({ length: 10 }).map((_, i) => {
      const row: any = {};
      table.columns.forEach((col) => {
        row[col.name] = `${col.name}_${i}`;
      });
      return row;
    });
    setTableData(mockData);
  };

  if (!selectedProject) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <SchemaViewer
          project={selectedProject}
          nodeTypes={{
            databaseSchema: (props: any) => (
              <TableContextMenu onViewData={() => handleTableClick(props.data.table)}>
                {props.children}
              </TableContextMenu>
            ),
          }}
        />
      </div>
      <div className="h-1/3 min-h-[300px] border-t">
        <TableDataViewer table={selectedTable} data={tableData} />
      </div>
    </div>
  );
}
