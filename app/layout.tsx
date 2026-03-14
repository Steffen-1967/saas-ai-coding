import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body id="layout-main" className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}