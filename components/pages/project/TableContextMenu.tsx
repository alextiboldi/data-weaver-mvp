
import * as React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface TableContextMenuProps {
  children: React.ReactNode;
  onViewData: () => void;
  position?: { x: number; y: number };
}

export function TableContextMenu({ children, onViewData, position }: TableContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem onClick={onViewData}>View Data</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
