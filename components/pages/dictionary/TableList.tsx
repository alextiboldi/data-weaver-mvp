
import { Table } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TableListProps {
  tables: Table[];
  onSelectTable: (table: Table) => void;
  selectedTableId?: string;
}

export function TableList({ tables, onSelectTable, selectedTableId }: TableListProps) {
  return (
    <div className="space-y-1">
      {tables.map((table) => (
        <button
          key={table.id}
          onClick={() => onSelectTable(table)}
          className={cn(
            "w-full text-left px-4 py-2 rounded-md hover:bg-accent transition-colors",
            selectedTableId === table.id && "bg-accent"
          )}
        >
          {table.name}
        </button>
      ))}
    </div>
  );
}
