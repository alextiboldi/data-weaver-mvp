
import { Table } from "@/lib/types";

interface TableDetailsProps {
  table: Table;
}

export function TableDetails({ table }: TableDetailsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [tableSynonym, setTableSynonym] = useState(table.synonym || '');
  const [tableDescription, setTableDescription] = useState(table.description || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [columnMetadata, setColumnMetadata] = useState(
    table.columns.reduce((acc, col) => ({
      ...acc,
      [col.id]: { synonym: col.synonym || '', description: col.description || '' }
    }), {})
  );

  const handleChange = () => {
    setHasChanges(true);
  };

  const saveAllChanges = async () => {
    setIsSaving(true);
    try {
      await updateTableMetadata();
      for (const columnId of Object.keys(columnMetadata)) {
        await updateColumnMetadata(columnId);
      }
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
    setIsSaving(false);
  };

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
    <div className="space-y-6 relative">
      <div className="absolute top-0 right-0">
        <button
          onClick={saveAllChanges}
          disabled={!hasChanges || isSaving}
          className={`px-4 py-2 rounded-md text-white transition-colors ${
            hasChanges 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
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
                  onChange={(e) => {
                    setTableSynonym(e.target.value);
                    handleChange();
                  }}
                />
              </td>
              <td className="p-3 border-t">
                <textarea
                  className="w-full bg-background border rounded-md px-2 py-1"
                  rows={2}
                  placeholder="Enter description"
                  value={tableDescription}
                  onChange={(e) => {
                    setTableDescription(e.target.value);
                    handleChange();
                  }}
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
