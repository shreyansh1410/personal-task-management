"use client";

import { useAuthStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { UserCircle, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.logout);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <header
      className={`fixed top-0 w-full transition-all duration-300 z-50
        ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
            : "bg-white dark:bg-gray-900"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
            >
              <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
                TaskFlow
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full py-2 px-4 transition-colors duration-200">
              <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {user && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name.split(" ")[0]}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
