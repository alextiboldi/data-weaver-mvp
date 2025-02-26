
import { Table as TableType } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableDetailViewerProps {
  table: TableType | null;
}

export function TableDetailViewer({ table }: TableDetailViewerProps) {
  if (!table) return null;

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Column</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Synonym</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.columns.map((column) => (
            <TableRow key={column.id}>
              <TableCell>{column.name}</TableCell>
              <TableCell>{column.type}</TableCell>
              <TableCell>{column.synonym || "-"}</TableCell>
              <TableCell>{column.description || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
