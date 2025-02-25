"use client";
import { useState } from "react";
import SchemaViewer from "@/components/pages/project/SchemaViewer";
import { TableContextMenu } from "@/components/pages/project/TableContextMenu";
import { TableDataViewer } from "@/components/pages/project/TableDataViewer";
import useStore from "@/store/app-store";
import { Table } from "@/lib/types";
import { SearchBar } from "@/components/search-bar";

export default function DataPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { selectedProject } = useStore();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/projects/${params.projectId}/search?q=${encodeURIComponent(
          searchTerm
        )}`
      );
      if (!response.ok) {
        throw new Error("Search failed");
      }
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };
  const handleTableClick = async (table: Table) => {
    setSelectedTable(table);
    try {
      const response = await fetch(
        `/api/projects/${params.projectId}/tables/${table.name}/data`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch table data");
      }
      const { data } = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setTableData([]);
    }
  };

  if (!selectedProject) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        {searchResults.length > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            Found matches in {searchResults.length} tables
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0">
        <SchemaViewer
          project={selectedProject}
          nodeTypes={{
            databaseSchema: (props: any) => (
              <TableContextMenu
                onViewData={() =>
                  handleTableClick({
                    id: props.id,
                    name: props.data.label,
                    columns: props.data.schema.map((s: any) => ({
                      name: s.title,
                      type: s.type,
                    })),
                  })
                }
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
