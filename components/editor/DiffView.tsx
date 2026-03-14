"use client";

import { useAppState } from "@/lib/state";

export default function DiffView() {
  const { diff } = useAppState();
  if (!diff) return null;

  return (
    <div id="diffview-main" className="h-full overflow-auto bg-slate-900 text-slate-100 text-xs font-mono p-3">
      <div id="codeeditor-controls-above" className="mb-2 text-slate-300">
        Diff für <span className="font-semibold">{diff.path}</span>
      </div>
      <pre>{diff.diff}</pre>
    </div>
  );
}