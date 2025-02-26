
import { Table } from "@/lib/types";

interface TableDetailsProps {
  table: Table;
}

export function TableDetails({ table }: TableDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Table Name</th>
              <th className="p-3 text-left">Synonym</th>
              <th className="p-3 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-t">{table.name}</td>
              <td className="p-3 border-t">
                <input
                  type="text"
                  className="w-full bg-background border rounded-md px-2 py-1"
                  placeholder="Enter synonym"
                />
              </td>
              <td className="p-3 border-t">
                <textarea
                  className="w-full bg-background border rounded-md px-2 py-1"
                  rows={2}
                  placeholder="Enter description"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Settings</th>
              <th className="p-3 text-left">References</th>
              <th className="p-3 text-left">Synonym</th>
              <th className="p-3 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {table.columns.map((column) => (
              <tr key={column.id}>
                <td className="p-3 border-t">{column.name}</td>
                <td className="p-3 border-t">{column.type}</td>
                <td className="p-3 border-t">
                  {column.isPrimaryKey && "Primary Key"}
                </td>
                <td className="p-3 border-t">
                  {table.relationships
                    .filter((rel) => rel.sourceColumn === column.name)
                    .map((rel) => (
                      <div key={rel.id}>
                        {rel.targetTableId}.{rel.targetColumn}
                      </div>
                    ))}
                </td>
                <td className="p-3 border-t">
                  <input
                    type="text"
                    className="w-full bg-background border rounded-md px-2 py-1"
                    placeholder="Enter synonym"
                  />
                </td>
                <td className="p-3 border-t">
                  <textarea
                    className="w-full bg-background border rounded-md px-2 py-1"
                    rows={2}
                    placeholder="Enter description"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
