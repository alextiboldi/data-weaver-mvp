
"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SearchDrawerProps {
  projectId: string;
}

export function SearchDrawer({ projectId }: SearchDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/search?q=${encodeURIComponent(
          searchTerm
        )}`
      );
      if (!response.ok) {
        throw new Error("Search failed");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed left-0 top-1/4 z-40 flex">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="bg-background border rounded-r-md shadow-md"
      >
        <div className="relative">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute -right-8 top-2 p-1 h-8 w-8 rounded-full"
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="w-80 max-h-[60vh] flex flex-col data-[state=closed]:animate-collapsibleClose data-[state=open]:animate-collapsibleOpen">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium mb-2">Search Database</h3>
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>
        <div className="overflow-auto flex-1 p-2">
          {searchResults.length > 0 ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Found matches in {searchResults.length} tables
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead>Column</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.table_name}</TableCell>
                      <TableCell>{result.column_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              {isSearching ? "Searching..." : "No results found"}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
