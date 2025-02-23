
"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface DataSourceCard {
  id: string;
  label: string;
  name: string;
  image: string;
  type: "database" | "file" | "api";
}

interface ProjectDetails {
  name: string;
  shortDescription: string;
  fullDescription: string;
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
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    name: "",
    shortDescription: "",
    fullDescription: ""
  });

  const handleNext = () => {
    if (step === 1 && projectDetails.name.trim()) {
      setStep(2);
    } else if (step === 2 && selectedSource) {
      setStep(3);
    }
  };

  const handleProjectDetailsChange = (field: keyof ProjectDetails) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjectDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const renderProjectDetailsForm = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="projectName">Project Name*</Label>
          <Input
            id="projectName"
            value={projectDetails.name}
            onChange={handleProjectDetailsChange("name")}
            placeholder="My Awesome Project"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input
            id="shortDescription"
            value={projectDetails.shortDescription}
            onChange={handleProjectDetailsChange("shortDescription")}
            placeholder="A brief description of your project"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fullDescription">Full Description</Label>
          <Textarea
            id="fullDescription"
            value={projectDetails.fullDescription}
            onChange={handleProjectDetailsChange("fullDescription")}
            placeholder="A detailed description of your project"
            className="min-h-[100px]"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!projectDetails.name.trim()}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderDataSourceSelection = () => (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => setStep(1)}
        className="mb-4"
      >
        ← Back
      </Button>
      <Tabs defaultValue="databases" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="databases">Databases</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
        </TabsList>
        <TabsContent value="databases" className="mt-6">
          <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px]">
            {dataSources
              .filter((ds) => ds.type === "database")
              .map((source) => (
                <Card
                  key={source.id}
                  className={`cursor-pointer transition-colors h-[120px] ${
                    selectedSource === source.id
                      ? "border-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedSource(source.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4 h-full">
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
          <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px]">
            {dataSources
              .filter((ds) => ds.type === "file")
              .map((source) => (
                <Card
                  key={source.id}
                  className={`cursor-pointer transition-colors h-[120px] ${
                    selectedSource === source.id
                      ? "border-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedSource(source.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4 h-full">
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
  );

  const renderDataSourceForm = () => {
    if (selectedSource === "postgres" || selectedSource === "mssql") {
      return (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setStep(2)}
            className="mb-4"
          >
            ← Back
          </Button>
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
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setStep(2)}
          className="mb-4"
        >
          ← Back
        </Button>
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
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {step === 1 && renderProjectDetailsForm()}
      {step === 2 && renderDataSourceSelection()}
      {step === 3 && renderDataSourceForm()}
    </div>
  );
}
