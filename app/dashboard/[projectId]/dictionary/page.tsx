
"use client";
import { useState } from "react";
import useStore from "@/store/app-store";
import { TableList } from "@/components/pages/dictionary/TableList";
import { TableDetails } from "@/components/pages/dictionary/TableDetails";
import { Table } from "@/lib/types";

export default function DictionaryPage() {
  const { selectedProject } = useStore();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  return (
    <div className="flex h-full">
      <div className="w-1/4 border-r p-4 bg-background">
        <h2 className="text-xl font-semibold mb-4">Tables</h2>
        {selectedProject && (
          <TableList
            tables={selectedProject.tables}
            onSelectTable={setSelectedTable}
            selectedTableId={selectedTable?.id}
          />
        )}
      </div>
      <div className="flex-1 p-6">
        {selectedTable ? (
          <TableDetails table={selectedTable} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a table to view details
          </div>
        )}
      </div>
    </div>
  );
}
