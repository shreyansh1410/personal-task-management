"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useStore";

export default function Home() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token=")
    );
    const tokenValue = tokenCookie?.split("=")?.[1];

    if (tokenValue || token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [token, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">
        Personal Task Management System
      </h1>
      <p className="text-gray-400">Loading...</p>
    </main>
  );
}