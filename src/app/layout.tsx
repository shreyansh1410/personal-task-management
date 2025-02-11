import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react"; // Import React

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Task Management System",
  description: "Organize your daily tasks and projects efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
