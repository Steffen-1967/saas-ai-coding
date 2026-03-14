"use client";

import Editor from "@monaco-editor/react";
import { useAppState } from "@/lib/state";
import { api } from "@/lib/apiClient";
import { useCallback } from "react";
import { getLanguage } from "@/lib/editorUtils";

export default function CodeEditor() {
  const { selectedFile, fileContent, setFileContent } = useAppState();

  const handleSave = useCallback(() => {
    if (!selectedFile) return;
    api.writeFile(selectedFile, fileContent).catch(console.error);
  }, [selectedFile, fileContent]);

  if (!selectedFile) {
    return (
      <div id="codeeditor-no-file-selected" className="flex-1 flex items-center justify-center text-slate-400">
        Keine Datei ausgewählt
      </div>
    );
  }

  return (
    <div id="codeeditor-main" className="flex flex-col h-full">
      {/* Header */}
      <div id="codeeditor-controls-above" className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-slate-50">
        <div className="text-sm font-medium text-slate-700">
          {selectedFile}
        </div>
        <button
          onClick={handleSave}
          className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Speichern
        </button>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="100%"
        language={getLanguage(selectedFile)}
        value={fileContent}
        onChange={(value) => setFileContent(value ?? "")}
        theme="vs-light"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          automaticLayout: true,
        }}
      />
    </div>
  );
}