"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Table as DBTable } from "@/lib/types";
import useStore from "@/store/app-store";

import { useEffect, useState } from "react";

interface TableDetailsProps {
  table: DBTable;
}

export function TableDetails({ table }: TableDetailsProps) {
  const { currentProject } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [tableSynonym, setTableSynonym] = useState(table.synonym || "");
  const [tableDescription, setTableDescription] = useState(
    table.description || ""
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [columnMetadata, setColumnMetadata] = useState(
    table.columns.reduce(
      (acc, col) => ({
        ...acc,
        [col.id]: {
          synonym: col.synonym || "",
          description: col.description || "",
        },
      }),
      {}
    )
  );

  useEffect(() => {
    setColumnMetadata(
      table.columns.reduce(
        (acc, col) => ({
          ...acc,
          [col.id]: {
            synonym: col.synonym || "",
            description: col.description || "",
          },
        }),
        {}
      )
    );
  }, [table.columns]);

  const handleChange = () => {
    setHasChanges(true);
  };

  const handleColumnChange = (
    columnId: string,
    field: string,
    value: string
  ) => {
    setColumnMetadata((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        [field]: value,
      },
    }));
    handleChange();
  };

  const saveAllChanges = async () => {
    setIsSaving(true);
    try {
      await updateTableMetadata();
      await updateAllColumnMetadata();
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
    setIsSaving(false);
  };

  const updateTableMetadata = async () => {
    try {
      await fetch(
        `/api/projects/${currentProject.id}/dictionary/update-table`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tableId: table.id,
            synonym: tableSynonym,
            description: tableDescription,
          }),
        }
      );
    } catch (error) {
      console.error("Failed to update table metadata:", error);
    }
  };

  const updateAllColumnMetadata = async () => {
    try {
      await fetch(
        `/api/projects/${currentProject.id}/dictionary/update-column`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            columns: columnMetadata,
          }),
        }
      );
    } catch (error) {
      console.error("Failed to update column metadata:", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {table.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage table schema and properties
            </p>
          </div>
          <Button disabled={!hasChanges} onClick={saveAllChanges}>
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Table Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="synonym">Synonym</Label>
                  <Input
                    id="synonym"
                    value={tableSynonym}
                    onChange={(e) => {
                      setTableSynonym(e.target.value);
                      handleChange();
                    }}
                    placeholder="Enter synonym"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={tableDescription}
                    onChange={(e) => {
                      setTableDescription(e.target.value);
                      handleChange();
                    }}
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Columns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Settings</TableHead>
                    <TableHead>References</TableHead>
                    <TableHead>Synonym</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.columns.map((column) => (
                    <TableRow key={column.name}>
                      <TableCell className="font-medium">
                        {column.name}
                      </TableCell>
                      <TableCell>{column.type}</TableCell>
                      <TableCell>
                        {column.isPrimaryKey && (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Pk
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {table.relationships
                          .filter((rel) => rel.sourceColumn === column.name)
                          .map((rel) => (
                            <span
                              key={rel.id}
                              className="text-sm text-muted-foreground"
                            >
                              {rel.targetTableId}.{rel.targetColumn}
                            </span>
                          ))}
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Enter synonym"
                          className="h-8"
                          value={columnMetadata[column.id]?.synonym || ""}
                          onChange={(e) =>
                            handleColumnChange(
                              column.id,
                              "synonym",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Enter description"
                          className="h-8"
                          value={columnMetadata[column.id]?.description || ""}
                          onChange={(e) =>
                            handleColumnChange(
                              column.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
