import { Node, NodeProps, Position } from "@xyflow/react";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";

import { BaseNode } from "@/components/base-node";
import { LabeledHandle } from "@/components/labeled-handle";
import { useEffect } from "react";
import useStore from "@/store/app-store";

type DatabaseSchemaNode = Node<{
  label: string;
  schema: { title: string; type: string }[];
}>;

export function DatabaseSchemaNode({
  data,
  selected,
  searchResults,
}: NodeProps<DatabaseSchemaNode> & { searchResults?: any[] }) {
  const { setSelectedTable } = useStore();

  useEffect(() => {
    if (selected) setSelectedTable(data.label);
  }, [selected]);

  //find a value form the search array in the data.schema array
  let columnsToHighlight: string[] = [];
  searchResults?.forEach((result) => {
    data.schema.forEach((entry) => {
      if (result.column_name === entry.title) {
        columnsToHighlight.push(entry.title);
        console.log("Found in table: ", data.label, "column: ", entry.title);
      }
    });
  });

  // // const matchedColumns =
  // //   searchResults?.find((result) => result.column_name === data.label)
  // //     ?.matches || [];
  const isTableMatched = columnsToHighlight.length > 0;

  return (
    <BaseNode
      className={`p-0 (${isTableMatched ? "border-2 border-red-500" : ""})`}
      selected={isTableMatched || selected}
    >
      <h2 className="rounded-tl-md rounded-tr-md bg-secondary p-2 text-center text-sm text-muted-foreground">
        {data.label}
        {isTableMatched}
      </h2>
      {/* shadcn Table cannot be used because of hardcoded overflow-auto */}
      <table className="border-spacing-10 overflow-visible">
        <TableBody>
          {data.schema.map((entry) => {
            const isHighlighted = columnsToHighlight.includes(entry.title);
            return (
              <TableRow
                key={entry.title}
                className={`relative text-xs ${
                  isHighlighted ? "border-2 border-red-500" : ""
                }`}
              >
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
            );
          })}
        </TableBody>
      </table>
    </BaseNode>
  );
}
