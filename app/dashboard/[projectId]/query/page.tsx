"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Database, Play, Save } from "lucide-react";
import { SqlQueryEditor } from "@/components/pages/query/SqlQueryEditor";
import { SavedQueriesList } from "@/components/pages/query/SavedQueriesList";
import useStore from "@/store/app-store";
import { Query } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function QueryPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { selectedProject } = useStore();
  const [currentQuery, setCurrentQuery] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [savedQueries, setSavedQueries] = useState<Query[]>([]);
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQueryTitle, setNewQueryTitle] = useState("");
  const [newQueryDescription, setNewQueryDescription] = useState("");

  // Fetch saved queries when component mounts
  useEffect(() => {
    if (selectedProject) {
      fetchSavedQueries();
    }
  }, [selectedProject]);

  const fetchSavedQueries = async () => {
    try {
      const response = await fetch(`/api/projects/${params.projectId}/queries`);
      if (response.ok) {
        const data = await response.json();
        setSavedQueries(data);
      }
    } catch (error) {
      console.error("Failed to fetch saved queries:", error);
    }
  };

  const handleRunQuery = async () => {
    if (!selectedText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/query/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: params.projectId,
          query: selectedText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQueryResults(data);
      } else {
        // Handle error
        const error = await response.json();
        setQueryResults([{ error: error.message }]);
      }
    } catch (error) {
      console.error("Failed to run query:", error);
      setQueryResults([{ error: "Failed to run query" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuery = async () => {
    if (!selectedText.trim() || !newQueryTitle.trim()) return;

    try {
      const response = await fetch(
        `/api/projects/${params.projectId}/queries/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: params.projectId,
            name: newQueryTitle,
            description: newQueryDescription,
            query: selectedText,
          }),
        }
      );

      if (response.ok) {
        // Refresh the list of saved queries
        fetchSavedQueries();
        // Reset form fields
        setNewQueryTitle("");
        setNewQueryDescription("");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to save query:", error);
    }
  };

  const handleSelectQuery = (query: Query) => {
    setCurrentQuery(query.query);
  };

  return (
    <div className="flex h-full">
      {/* Saved Queries Panel */}
      <SavedQueriesList
        queries={savedQueries}
        onSelectQuery={handleSelectQuery}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">SQL Query</h1>
          <div className="space-x-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  disabled={!selectedText.trim()}
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Query</DialogTitle>
                  <DialogDescription>
                    Save your selected query text for future use.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="query-title">Title</Label>
                    <Input
                      id="query-title"
                      value={newQueryTitle}
                      onChange={(e) => setNewQueryTitle(e.target.value)}
                      placeholder="Enter a title for your query"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="query-description">Description</Label>
                    <Textarea
                      id="query-description"
                      value={newQueryDescription}
                      onChange={(e) => setNewQueryDescription(e.target.value)}
                      placeholder="Enter a description (optional)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveQuery}
                    disabled={!selectedText.trim() || !newQueryTitle.trim()}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              onClick={handleRunQuery}
              disabled={isLoading || !selectedText.trim()}
              className="gap-2"
            >
              {isLoading ? (
                "Running..."
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Query
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Query Editor */}
        <div className="space-y-2">
          <SqlQueryEditor 
            value={currentQuery} 
            onChange={setCurrentQuery} 
            onSelectionChange={setSelectedText} 
          />
          <p className="text-xs text-muted-foreground italic">
            {selectedText.trim() 
              ? "Selected text will be executed" 
              : "Select text in the editor to enable query execution"}
          </p>
        </div>

        {/* Results Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Results</h2>
          <Separator className="mb-4" />

          {queryResults === null ? (
            <div className="text-center py-12 text-muted-foreground">
              Run a query to see results
            </div>
          ) : queryResults.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Query executed successfully. No results returned.
            </div>
          ) : queryResults[0]?.error ? (
            <div className="text-center py-12 text-destructive">
              {queryResults[0].error}
            </div>
          ) : (
            <div className="overflow-auto border rounded-md">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-muted">
                    {Object.keys(queryResults[0]).map((key) => (
                      <TableHead
                        key={key}
                        className="px-4 py-2 text-left font-medium"
                      >
                        {key}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queryResults.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className="border-t">
                      {Object.values(row).map((value: any, valueIndex) => (
                        <TableCell key={valueIndex} className="px-4 py-2">
                          {value === null ? "NULL" : String(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
