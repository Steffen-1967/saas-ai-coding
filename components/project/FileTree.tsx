"use client";

import { useEffect } from "react";
import { useAppState } from "@/lib/state";
import type { FileNode } from "@/lib/types";

export default function FileTree() {
  const { tree, loadFolder } = useAppState();

  // Root laden
  useEffect(() => {
    loadFolder("");
  }, [loadFolder]);

  const rootItems = tree[""] || [];

  return (
    <div id="filetree-main" className="overflow-auto bg-white">
      <div id="filetree-head" className="px-3 py-2 font-semibold text-slate-500 uppercase">
        Dateien
      </div>

      <div id="filetree-list" className="px-2 pb-4">
        {rootItems.map((node) => (
          <TreeNode key={node.path} node={node} />
        ))}
      </div>
    </div>
  );
}

function TreeNode({ node }: { node: FileNode }) {
  const { tree, loadFolder, selectFile, selectedFile } = useAppState();

  if (node.type === "folder") {
    const children = tree[node.path];

    return (
      <div className="ml-2">
        <div
          className="cursor-pointer text-sm text-slate-900"
          onClick={() => loadFolder(node.path)}
        >
          📁 {node.name}
        </div>

        {children && (
          <div className="ml-4">
            {children.map((child) => (
              <TreeNode key={child.path} node={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`cursor-pointer px-2 py-1 text-sm ${
        selectedFile === node.path
          ? "bg-blue-100 text-blue-700"
          : "text-slate-700 hover:bg-slate-100"
      }`}
      onClick={() => selectFile(node.path)}
    >
      📄 {node.name}
    </div>
  );
}