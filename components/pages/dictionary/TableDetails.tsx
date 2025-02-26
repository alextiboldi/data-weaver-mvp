
import { Table } from "@/lib/types";

interface TableDetailsProps {
  table: Table;
}

export function TableDetails({ table }: TableDetailsProps) {
  const [tableSynonym, setTableSynonym] = useState(table.synonym || '');
  const [tableDescription, setTableDescription] = useState(table.description || '');
  const [columnMetadata, setColumnMetadata] = useState(
    table.columns.reduce((acc, col) => ({
      ...acc,
      [col.id]: { synonym: col.synonym || '', description: col.description || '' }
    }), {})
  );

  const updateTableMetadata = async () => {
    try {
      await fetch('/api/dictionary/update-table', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: table.id,
          synonym: tableSynonym,
          description: tableDescription,
        }),
      });
    } catch (error) {
      console.error('Failed to update table metadata:', error);
    }
  };

  const updateColumnMetadata = async (columnId: string) => {
    try {
      await fetch('/api/dictionary/update-column', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          columnId,
          ...columnMetadata[columnId],
        }),
      });
    } catch (error) {
      console.error('Failed to update column metadata:', error);
    }
  };
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
                  value={tableSynonym}
                  onChange={(e) => setTableSynonym(e.target.value)}
                  onBlur={updateTableMetadata}
                />
              </td>
              <td className="p-3 border-t">
                <textarea
                  className="w-full bg-background border rounded-md px-2 py-1"
                  rows={2}
                  placeholder="Enter description"
                  value={tableDescription}
                  onChange={(e) => setTableDescription(e.target.value)}
                  onBlur={updateTableMetadata}
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
