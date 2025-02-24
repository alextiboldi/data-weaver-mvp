
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
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent 
        className="w-40"
        style={position ? { 
          position: 'absolute', 
          top: position.y, 
          left: position.x 
        } : undefined}
      >
        <ContextMenuItem onClick={onViewData}>View Data</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
