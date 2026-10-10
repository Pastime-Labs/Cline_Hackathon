import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ReValue — make room for something good", description: "A local prototype for transparent reuse and recycling." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
