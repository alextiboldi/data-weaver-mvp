
import { Node, NodeProps, Position } from "@xyflow/react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BaseNode } from "@/components/base-node";
import { LabeledHandle } from "@/components/labeled-handle";

type DatabaseSchemaNode = Node<{
  label: string;
  schema: { title: string; type: string }[];
}>;

export function DatabaseSchemaNode({
  data,
  selected,
}: NodeProps<DatabaseSchemaNode>) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <BaseNode className="p-0" selected={selected} onContextMenu={handleContextMenu}>
      <h2 className="rounded-tl-md rounded-tr-md bg-secondary p-2 text-center text-sm text-muted-foreground">
        {data.label}
      </h2>
      <table className="border-spacing-10 overflow-visible">
        <TableBody>
          {data.schema.map((entry) => (
            <TableRow key={entry.title} className="relative text-xs">
              <TableCell className="pl-0 pr-6 font-light">
                <LabeledHandle
                  id={entry.title}
                  title={entry.title}
                  type="target"
                  position={Position.Left}
                />
              </TableCell>
              <TableCell className="pr-0 text-right font-thin">
                <LabeledHandle
                  id={entry.title}
                  title={entry.type}
                  type="source"
                  position={Position.Right}
                  className="p-0"
                  handleClassName="p-0"
                  labelClassName="p-0"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </BaseNode>
  );
}
