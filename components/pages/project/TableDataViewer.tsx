
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Table as TableType } from "@/lib/types";

interface TableDataViewerProps {
  table: TableType | null;
  data: any[];
}

export function TableDataViewer({ table, data }: TableDataViewerProps) {
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
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {table.columns.map((column) => (
                <TableCell key={column.id}>{row[column.name]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
