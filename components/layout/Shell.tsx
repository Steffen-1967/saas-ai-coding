"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { ReactNode } from "react";

export default function Shell({ children, onOpenProject }) {
  return (
    <div id="shell-main" className="flex h-screen">
      <Sidebar />
      <div id="shell-work-area" className="flex flex-col flex-1 overflow-hidden">
        <Topbar onOpenProject={onOpenProject} />
        <div id="shell-children" className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}