import type React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 mt-16">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar/>
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Footer/>
    </div>
  );
}