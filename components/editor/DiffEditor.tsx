"use client";

import { DiffEditor } from "@monaco-editor/react";
import { useAppState } from "@/lib/state";
import { getLanguage } from "@/lib/editorUtils";

export default function DiffEditorView() {
  const { diff, selectedFile, fileContent } = useAppState();

  if (!diff) return null;

  return (
    <div id="diffeditor-main" className="h-full border-t border-slate-200">
      <DiffEditor
        height="100%"
        theme="vs-light"
        language={getLanguage(selectedFile || "")}
        original={fileContent}
        modified={diff.diffText ?? ""}
        options={{
          readOnly: true,
          renderSideBySide: true,
          automaticLayout: true,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
}