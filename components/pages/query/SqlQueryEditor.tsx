"use client";

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";
import { StateEffect, EditorState } from "@codemirror/state";

interface SqlQueryEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSelectionChange: (selection: string) => void;
}

export function SqlQueryEditor({ value, onChange, onSelectionChange }: SqlQueryEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

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
        extensions={[sql(), EditorView.lineWrapping, EditorView.updateListener.of(handleSelectionUpdate)]}
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
