"use client";

import { useState } from "react";
import { api } from "@/lib/apiClient";
import { useAppState } from "@/lib/state";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { selectedFile, selectFile, setDiff, setDryRunPatches } = useAppState();

  async function send(message: string, opts?: { dryRun?: boolean }) {
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setDiff(null);
    setDryRunPatches([]);

    try {
      if (opts?.dryRun) {
        const res = await api.dryRun(message);
        setDryRunPatches(res.patches);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Dry-Run durchgeführt." },
        ]);
        return;
      }

      const res = await api.chat(message, selectedFile || undefined);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);

      res.actions?.forEach((action) => {
        if (action.type === "openFile" && action.path) {
          selectFile(action.path);
        }
        if (action.type === "showDiff" && action.path) {
		  api.readFile(action.path).then((res) => {
			const original = res.content;

			// KI‑Vorschlag aus der Chat‑Antwort extrahieren
			const modified = res.modified ?? ""; // abhängig von deinem AI‑Service

			setDiff({
			  path: action.path,
			  original,
			  modified,
			  diffText: res.diff ?? "",
			});
		  });
		}
        if (action.type === "createFile" && action.path) {
          api.createFile(action.path).then(() => {
            // optional: FileTree neu laden
          });
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input.trim();
    setInput("");
    void send(msg);
  }

  function handleDryRun() {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput("");
    void send(msg, { dryRun: true });
  }

  return (
    <div id="chatpanel-main" className="flex flex-col h-full border-l border-slate-200 bg-white">
      <div id="chatpanel-head" className="px-3 py-2 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
        Chat
      </div>
      <div id="chatpanel-messages" className="flex-1 overflow-auto p-3 space-y-2 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "text-slate-800"
                : "bg-slate-100 rounded p-2 text-slate-700"
            }
          >
            {m.content}
          </div>
        ))}
      </div>
      <form id="chatpanel-editor-main" onSubmit={handleSubmit} className="border-t border-slate-200 p-2">
        <textarea id="chatpanel-editor-textarea"
          className="w-full text-sm border border-slate-300 rounded px-2 py-1 resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={6}
          placeholder="Frage die KI nach Refactoring, neuen Dateien, Erklärungen..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div id="chatpanel-editor-controls" className="flex justify-between mt-2">
          <button
            type="button"
            onClick={handleDryRun}
            className="text-xs px-3 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Dry-Run
          </button>
          <button
            type="submit"
            className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Senden
          </button>
        </div>
      </form>
    </div>
  );
}