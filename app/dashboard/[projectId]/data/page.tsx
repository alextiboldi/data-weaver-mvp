"use client";
import { useEffect, useState } from "react";
import SchemaViewer from "@/components/pages/project/SchemaViewer";
import { TableContextMenu } from "@/components/pages/project/TableContextMenu";
import { TableDataViewer } from "@/components/pages/project/TableDataViewer";
import { TableDetailViewer } from "@/components/pages/project/TableDetailViewer";
import useStore from "@/store/app-store";
import { Table } from "@/lib/types";
import { SearchBar } from "@/components/search-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronUp } from "lucide-react";
import { TableDetails } from "@/components/pages/dictionary/TableDetails";

export default function DataPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { selectedProject, selectedTable } = useStore();
  const [selectedTableForView, setSelectedTableForView] =
    useState<Table | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  useEffect(() => {
    console.log("Table selected: ", selectedTable);
    //find the table in the selected project by name
    const table = selectedProject?.tables.find(
      (table) => table.name === selectedTable
    );
    if (table) {
      setSelectedTableForView(table);
    }
  }, [selectedTable]);

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
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // const handleTableClick = async (table: Table) => {
  //   setSelectedTable(table);
  //   try {
  //     const response = await fetch(
  //       `/api/projects/${params.projectId}/tables/${table.name}/data`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch table data");
  //     }
  //     const { data } = await response.json();
  //     setTableData(data);
  //   } catch (error) {
  //     console.error("Error fetching table data:", error);
  //     setTableData([]);
  //   }
  // };

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
        <SchemaViewer project={selectedProject} searchResults={searchResults} />
      </div>
      <Collapsible
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        className="border-t bg-background"
      >
        <CollapsibleTrigger className="flex items-center justify-center w-full p-2 hover:bg-muted/50">
          <ChevronUp
            className={`h-4 w-4 transition-transform duration-200 ${
              isDrawerOpen ? "" : "rotate-180"
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="h-[300px] overflow-auto">
          <Tabs defaultValue="details" className="w-full h-full">
            <TabsList className="px-4 pt-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>
            <div className="p-4">
              <TabsContent value="details">
                {selectedTableForView ? (
                  <TableDetails table={selectedTableForView} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a table to view details
                  </div>
                )}
              </TabsContent>
              <TabsContent value="data">
                {/* <TableDataViewer table={selectedTable} data={tableData} /> */}
              </TabsContent>
            </div>
          </Tabs>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
