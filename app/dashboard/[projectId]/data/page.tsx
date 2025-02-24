
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
    try {
      const response = await fetch(`/api/projects/${params.projectId}/tables/${table.name}/data`);
      if (!response.ok) {
        throw new Error('Failed to fetch table data');
      }
      const { data } = await response.json();
      setTableData(data);
    } catch (error) {
      console.error('Error fetching table data:', error);
      setTableData([]);
    }
  };

  if (!selectedProject) return <div>Loading...</div>;

  const [searchTerm, setSearchTerm] = useState("");

const handleSearch = async (value: string) => {
  setSearchTerm(value);
  // Update node styles based on search term
  if (project?.tables) {
    const updatedNodes = project.tables.map(table => {
      const hasMatch = table.columns.some(col => 
        col.name.toLowerCase().includes(value.toLowerCase()) ||
        (tableData[table.tableName]?.some(row => 
          Object.values(row).some(cellValue => 
            String(cellValue).toLowerCase().includes(value.toLowerCase())
          )
        ))
      );
      
      return {
        ...table,
        style: hasMatch ? { border: '2px solid #3b82f6', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' } : {}
      };
    });
    
    // Update your nodes state here
    // This depends on how you're managing state in SchemaViewer
  }
};

return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="flex-1 min-h-0">
        <SchemaViewer
          project={selectedProject}
          nodeTypes={{
            databaseSchema: (props: any) => (
              <TableContextMenu 
                onViewData={() => handleTableClick({
                  id: props.id,
                  name: props.data.label,
                  columns: props.data.schema.map((s: any) => ({
                    name: s.title,
                    type: s.type
                  }))
                })}
              >
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
