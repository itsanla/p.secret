import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "secret key anla harpanda",
  description: "this is secret pages of anla harpanda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
