"use client";

import FileTree from "../project/FileTree";

export default function Sidebar() {
  return (
    <div id="sidebar-main" className="w-64 border-r border-slate-200 bg-white flex flex-col">
      <div id="sidebar-sub" className="flex-1 overflow-auto">
        <FileTree />
      </div>
    </div>
  );
}
