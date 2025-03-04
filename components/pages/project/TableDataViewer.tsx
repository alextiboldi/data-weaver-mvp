import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Table as TableType } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface TableDataViewerProps {
  isLoading: boolean;
  table: TableType | null;
  data: any[];
}

export function TableDataViewer({
  table,
  data,
  isLoading,
}: TableDataViewerProps) {
  if (!table) return null;

  return (
    <div className="w-full p-4 border rounded-lg mt-4">
      <h3 className="text-lg font-semibold mb-4">{table.name} Data</h3>
      <Table>
        <TableHeader>
          <TableRow>
            {table.columns.map((column) => (
              <TableHead key={column.id}>{column.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          </div>
        ) : (
          <TableBody className="overflow-auto">
            {data.map((row, i) => (
              <TableRow key={i}>
                {table.columns.map((column) => (
                  <TableCell key={column.id}>{row[column.name]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
}
