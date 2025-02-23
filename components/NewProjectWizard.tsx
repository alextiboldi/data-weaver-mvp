
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
  const [isConnectionTested, setIsConnectionTested] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Array<{ email: string; role: string }>>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("viewer");
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    name: "",
    shortDescription: "",
    fullDescription: ""
  });

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleTestConnection = () => {
    // Simulate connection test
    setTimeout(() => {
      setIsConnectionTested(true);
    }, 1000);
  };

  const handleAddTeamMember = () => {
    if (isValidEmail(newMemberEmail)) {
      setTeamMembers([...teamMembers, { email: newMemberEmail, role: newMemberRole }]);
      setNewMemberEmail("");
      setNewMemberRole("viewer");
    }
  };

  const handleRemoveTeamMember = (email: string) => {
    setTeamMembers(teamMembers.filter(member => member.email !== email));
  };

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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Create New Project</h2>
        <p className="text-muted-foreground">Fill in the details to get started with your new project.</p>
      </div>
      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="projectName" className="text-sm font-medium">Project Name*</Label>
            <Input
              id="projectName"
              value={projectDetails.name}
              onChange={handleProjectDetailsChange("name")}
              placeholder="My Awesome Project"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shortDescription" className="text-sm font-medium">Short Description</Label>
            <Input
              id="shortDescription"
              value={projectDetails.shortDescription}
              onChange={handleProjectDetailsChange("shortDescription")}
              placeholder="A brief description of your project"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fullDescription" className="text-sm font-medium">Full Description</Label>
            <Textarea
              id="fullDescription"
              value={projectDetails.fullDescription}
              onChange={handleProjectDetailsChange("fullDescription")}
              placeholder="A detailed description of your project"
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={!projectDetails.name.trim()}
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderDataSourceSelection = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => setStep(1)}
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Button>
        <div>
          <h2 className="text-2xl font-semibold">Choose Data Source</h2>
          <p className="text-muted-foreground mt-1">Select the type of data source you want to connect to.</p>
        </div>
      </div>
      
      <Tabs defaultValue="databases" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="databases">Databases</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
        </TabsList>
        <TabsContent value="databases">
          <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px]">
            {dataSources
              .filter((ds) => ds.type === "database")
              .map((source) => (
                <Card
                  key={source.id}
                  className={`cursor-pointer transition-all duration-200 h-[120px] ${
                    selectedSource === source.id
                      ? "border-primary ring-2 ring-primary ring-opacity-50"
                      : "hover:border-primary/50 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedSource(source.id)}
                >
                  <CardContent className="flex items-center gap-6 p-6 h-full">
                    <div className="w-12 h-12 relative shrink-0">
                      <Image
                        src={source.image}
                        alt={source.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{source.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {source.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="files">
          <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px]">
            {dataSources
              .filter((ds) => ds.type === "file")
              .map((source) => (
                <Card
                  key={source.id}
                  className={`cursor-pointer transition-all duration-200 h-[120px] ${
                    selectedSource === source.id
                      ? "border-primary ring-2 ring-primary ring-opacity-50"
                      : "hover:border-primary/50 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedSource(source.id)}
                >
                  <CardContent className="flex items-center gap-6 p-6 h-full">
                    <div className="w-12 h-12 relative shrink-0">
                      <Image
                        src={source.image}
                        alt={source.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{source.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {source.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="apis">
          <div className="text-center text-muted-foreground py-12 bg-muted/20 rounded-lg">
            API connections coming soon
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={!selectedSource}
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderDataSourceForm = () => {
    if (selectedSource === "postgres" || selectedSource === "mssql") {
      return (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setStep(2)}
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back
            </Button>
            <div>
              <h2 className="text-2xl font-semibold">Database Connection</h2>
              <p className="text-muted-foreground mt-1">Enter your database connection details.</p>
            </div>
          </div>
          <div className="grid gap-6 max-w-2xl">
            <div className="grid gap-2">
              <Label htmlFor="server">Server</Label>
              <Input id="server" placeholder="0.0.0.0" className="h-10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="port">Port</Label>
              <Input id="port" placeholder="5432" className="h-10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="database">Database Name</Label>
              <Input id="database" className="h-10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="schema">Schema</Label>
              <Input id="schema" placeholder="public" className="h-10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user">User</Label>
              <Input id="user" className="h-10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" className="h-10" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleTestConnection}
            >
              {isConnectionTested ? "Connection Successful" : "Test Connection"}
            </Button>
            <Button 
              size="lg" 
              onClick={() => setStep(4)}
              disabled={!isConnectionTested}
            >
              Next
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setStep(2)}
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">Upload File</h2>
            <p className="text-muted-foreground mt-1">Upload your data file.</p>
          </div>
        </div>
        <div className="border-2 border-dashed rounded-lg p-12 text-center bg-muted/10">
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
            <div className="text-sm">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              <div className="text-xs text-muted-foreground mt-1">
                {selectedSource === "csv" ? "CSV" : "JSON"} files only
              </div>
            </div>
          </label>
        </div>
      </div>
    );
  };

  const renderTeamInvites = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => setStep(3)}
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Button>
        <div>
          <h2 className="text-2xl font-semibold">Invite Team Members</h2>
          <p className="text-muted-foreground mt-1">Add team members to your project.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="team@example.com"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
            />
          </div>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={newMemberRole}
            onChange={(e) => setNewMemberRole(e.target.value)}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <Button
            onClick={handleAddTeamMember}
            disabled={!isValidEmail(newMemberEmail)}
          >
            Invite
          </Button>
        </div>

        {teamMembers.length > 0 && (
          <div className="rounded-md border">
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="font-medium">Email</th>
                    <th className="font-medium">Role</th>
                    <th className="font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-3">{member.email}</td>
                      <td className="py-3 capitalize">{member.role}</td>
                      <td className="py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTeamMember(member.email)}
                        >
                          <svg
                            className="size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          size="lg"
          onClick={() => {
            // Handle project creation
            const dialog = document.querySelector('[role="dialog"]');
            if (dialog) {
              const closeButton = dialog.querySelector('[data-radix-collection-item]');
              if (closeButton instanceof HTMLElement) {
                closeButton.click();
              }
            }
          }}
        >
          Create Project
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {step === 1 && renderProjectDetailsForm()}
      {step === 2 && renderDataSourceSelection()}
      {step === 3 && renderDataSourceForm()}
      {step === 4 && renderTeamInvites()}
    </div>
  );
}
