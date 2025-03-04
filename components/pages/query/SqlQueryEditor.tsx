"use client";

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";

interface SqlQueryEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SqlQueryEditor({ value, onChange }: SqlQueryEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        extensions={[sql(), EditorView.lineWrapping]}
        onChange={onChange}
        placeholder="Enter your SQL query here..."
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
