import { Button } from "@/components/ui/button";
import { Table } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Table2 } from "lucide-react";

interface TableListProps {
  tables: Table[];
  onSelectTable: (table: Table) => void;
  selectedTableId?: string;
}

export function TableList({
  tables,
  onSelectTable,
  selectedTableId,
}: TableListProps) {
  return (
    <nav className="space-y-1">
      {tables.map((table) => (
        <Button
          key={table.id}
          onClick={() => onSelectTable(table)}
          variant={selectedTableId === table.id ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start text-sm",
            selectedTableId === table.id && "bg-muted font-medium"
          )}
        >
          <Table2 className="mr-2 h-4 w-4" />
          {table.name}
        </Button>
      ))}
    </nav>
  );
}
