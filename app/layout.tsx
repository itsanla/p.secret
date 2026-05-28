import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "anla secret",
  description: "Personal key vault & authenticator",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg)" }}>
        {/* Fixed dot grid — stays in place saat scroll */}
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.13) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
          zIndex: 0,
        }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
