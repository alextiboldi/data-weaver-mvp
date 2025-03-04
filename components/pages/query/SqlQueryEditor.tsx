"use client";

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";
import {
  autocompletion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";
import useStore from "@/store/app-store";

interface SqlQueryEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSelectionChange: (selection: string) => void;
}

export function SqlQueryEditor({
  value,
  onChange,
  onSelectionChange,
}: SqlQueryEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { selectedProject } = useStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSelectionUpdate = (viewUpdate: any) => {
    if (viewUpdate.selectionSet) {
      const state = viewUpdate.state;
      const selection = state.selection.main;
      if (selection.from !== selection.to) {
        const selectedText = state.sliceDoc(selection.from, selection.to);
        onSelectionChange(selectedText);
      } else {
        onSelectionChange("");
      }
    }
  };

  // SQL autocomplete function based on project data
  const sqlCompletions = (
    context: CompletionContext
  ): CompletionResult | null => {
    if (!selectedProject) return null;

    const word = context.matchBefore(/\w*/);
    if (!word || word.from === word.to) return null;

    const tableSuggestions = selectedProject.tables.map((table) => ({
      label: table.name,
      type: "keyword",
      detail: "table",
      info: table.comment || table.description || "Table",
    }));

    const columnSuggestions = selectedProject.tables.flatMap((table) =>
      table.columns.map((column) => ({
        label: column.name,
        type: "property",
        detail: `${table.name}.${column.type}`,
        info: column.comment || column.description || "Column",
      }))
    );

    const sqlKeywords = [
      { label: "SELECT", type: "keyword" },
      { label: "FROM", type: "keyword" },
      { label: "WHERE", type: "keyword" },
      { label: "JOIN", type: "keyword" },
      { label: "LEFT JOIN", type: "keyword" },
      { label: "RIGHT JOIN", type: "keyword" },
      { label: "INNER JOIN", type: "keyword" },
      { label: "GROUP BY", type: "keyword" },
      { label: "ORDER BY", type: "keyword" },
      { label: "LIMIT", type: "keyword" },
      { label: "COUNT", type: "function" },
      { label: "SUM", type: "function" },
      { label: "AVG", type: "function" },
      { label: "MIN", type: "function" },
      { label: "MAX", type: "function" },
    ];

    const schema = {
      label: selectedProject.connectionConfig.schema || "public",
      type: "property",
      detail: "schema",
      info: "Schema",
    };
    console.log(selectedProject.connectionConfig.schema);
    const options = [
      schema,
      ...tableSuggestions,
      ...columnSuggestions,
      ...sqlKeywords,
    ];

    return {
      from: word.from,
      options,
      filter: true,
    };
  };

  if (!isMounted) {
    return (
      <div className="w-full h-[200px] border rounded-md bg-muted/20 animate-pulse" />
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <CodeMirror
        value={value}
        height="200px"
        theme={vscodeLight}
        extensions={[
          sql(),
          EditorView.lineWrapping,
          EditorView.updateListener.of(handleSelectionUpdate),
          autocompletion({ override: [sqlCompletions] }),
        ]}
        onChange={onChange}
        placeholder="Enter your SQL query here and select text to run..."
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightSelectionMatches: true,
        }}
      />
    </div>
  );
}
