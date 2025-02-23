
"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface DataSourceCard {
  id: string;
  label: string;
  name: string;
  image: string;
  type: "database" | "file" | "api";
}

const dataSources: DataSourceCard[] = [
  { id: "postgres", label: "PostgreSQL", name: "postgres", image: "/postgres.svg", type: "database" },
  { id: "mssql", label: "Microsoft SQL", name: "mssql", image: "/mssql.svg", type: "database" },
  { id: "csv", label: "CSV File", name: "csv", image: "/csv.svg", type: "file" },
  { id: "json", label: "JSON File", name: "json", image: "/json.svg", type: "file" },
];

export function NewProjectWizard() {
  const [step, setStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedSource) setStep(2);
  };

  const renderDatabaseForm = () => {
    if (selectedSource === "postgres") {
      return (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="server">Server</Label>
            <Input id="server" placeholder="localhost" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="port">Port</Label>
            <Input id="port" placeholder="5432" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="database">Database Name</Label>
            <Input id="database" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="schema">Schema</Label>
            <Input id="schema" placeholder="public" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user">User</Label>
            <Input id="user" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
        </div>
      );
    }

    if (selectedSource === "mssql") {
      return (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="server">Server</Label>
            <Input id="server" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="database">Database</Label>
            <Input id="database" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="uid">UID</Label>
            <Input id="uid" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
        </div>
      );
    }
  };

  const renderFileUpload = () => {
    return (
      <div className="border-2 border-dashed rounded-lg p-12 text-center">
        <input
          type="file"
          className="hidden"
          id="file-upload"
          accept={selectedSource === "csv" ? ".csv" : ".json"}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-4"
        >
          <div className="rounded-full bg-primary/10 p-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Click to upload</span> or
            drag and drop
          </div>
        </label>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {step === 1 ? (
        <div className="space-y-6">
          <Tabs defaultValue="databases">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="databases">Databases</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="apis">APIs</TabsTrigger>
            </TabsList>
            <TabsContent value="databases" className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                {dataSources
                  .filter((ds) => ds.type === "database")
                  .map((source) => (
                    <Card
                      key={source.id}
                      className={`cursor-pointer transition-colors ${
                        selectedSource === source.id
                          ? "border-primary"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedSource(source.id)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="w-12 h-12 relative">
                          <Image
                            src={source.image}
                            alt={source.label}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{source.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {source.name}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="files" className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                {dataSources
                  .filter((ds) => ds.type === "file")
                  .map((source) => (
                    <Card
                      key={source.id}
                      className={`cursor-pointer transition-colors ${
                        selectedSource === source.id
                          ? "border-primary"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedSource(source.id)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="w-12 h-12 relative">
                          <Image
                            src={source.image}
                            alt={source.label}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{source.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {source.name}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="apis" className="mt-6">
              <div className="text-center text-muted-foreground py-12">
                API connections coming soon
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!selectedSource}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setStep(1)}
            className="mb-4"
          >
            ← Back
          </Button>
          {selectedSource === "postgres" || selectedSource === "mssql"
            ? renderDatabaseForm()
            : renderFileUpload()}
        </div>
      )}
    </div>
  );
}
