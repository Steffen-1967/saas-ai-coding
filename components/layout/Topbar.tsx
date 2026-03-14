"use client";

export default function Topbar({ onOpenProject }) {
  return (
    <div id="topbar-main" className="h-12 bg-slate-100 border-b border-slate-300 px-4 flex items-center justify-between">

      {/* Linke Seite */}
      <div id="topbar-title" className="font-semibold text-slate-700">
        AI Coding Assistant
      </div>

      {/* Rechte Seite */}
      <div id="topbar-project-selector" className="flex items-center gap-3">
        <button
          onClick={onOpenProject}
          className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Projekt auswählen
        </button>
      </div>

    </div>
  );
}
