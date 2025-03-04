
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, FileText, MoreVertical } from "lucide-react";
import { Query } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SavedQueriesListProps {
  queries: Query[];
  onSelectQuery: (query: Query) => void;
  onLoadQuery: (query: Query) => void;
  onEditQuery: (query: Query) => void;
  onDeleteQuery: (queryId: string) => void;
}

export function SavedQueriesList({ 
  queries, 
  onSelectQuery, 
  onLoadQuery, 
  onEditQuery, 
  onDeleteQuery 
}: SavedQueriesListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`relative border-r transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-72"
      }`}
    >
      <div className="sticky top-0 bg-background z-10 p-2 flex items-center justify-between border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <h2 className="font-semibold">Saved Queries</h2>
            <Badge variant="secondary" className="ml-1">
              {queries.length}
            </Badge>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={isCollapsed ? "mx-auto" : ""}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <ScrollArea className="h-[calc(100vh-8rem)] px-2">
          <div className="space-y-2 py-2">
            {queries.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No saved queries yet
              </div>
            ) : (
              queries.map((query) => (
                <div
                  key={query.id}
                  className="p-3 rounded-md border hover:bg-muted/50 cursor-pointer transition-colors flex justify-between items-start"
                >
                  <div 
                    className="flex-1" 
                    onClick={() => onSelectQuery(query)}
                  >
                    <h3 className="font-medium text-sm">{query.name}</h3>
                    {query.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                        {query.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditQuery(query)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onLoadQuery(query)}>
                        Load
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteQuery(query.id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
