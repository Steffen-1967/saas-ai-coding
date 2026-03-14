"use client";

import Shell from "@/components/layout/Shell";
import CodeEditor from "@/components/editor/CodeEditor";
import DiffEditorView from "@/components/editor/DiffEditor";
import ChatPanel from "@/components/chat/ChatPanel";
import { useAppState } from "@/lib/state";
import { api } from "@/lib/apiClient";
import { useState } from "react";

export default function HomePage() {
  const { diff } = useAppState();
  const [projectRoot, setProjectRoot] = useState<string | null>(null);

  async function handleOpenProject() {
    const path = prompt("Bitte Projektpfad eingeben:");
    if (!path) return;

    try {
      const res = await api.openProject(path);
      setProjectRoot(res.root);
    } catch (err) {
      alert("Fehler beim Öffnen des Projekts: " + (err as Error).message);
    }
  }

  return (
    <Shell onOpenProject={handleOpenProject}>
      <div id="page-main" className="flex h-full overflow-hidden">
        {/* Editor-Bereich */}
        <div id="page-editor" className="flex-1 flex flex-col">
          {diff ? <DiffEditorView /> : <CodeEditor />}
        </div>

        {/* Chat rechts */}
        <div id="page-chat" className="w-[28rem] border-l border-slate-200">
          <ChatPanel />
        </div>

      </div>
    </Shell>
  );
}
