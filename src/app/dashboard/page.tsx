"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import TaskStatistics from "@/components/TasksStatistics";
import TaskCalendar from "@/components/TaskCalendar";
import { useAuthStore } from "@/store/useStore";
import type { Task } from "@/types";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [filterPriority, setFilterPriority] = useState("");
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    // Check if we have a token in cookies
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token=")
    );
    const tokenValue = tokenCookie?.split("=")?.[1];

    if (!tokenValue && !token) {
      router.replace("/login");
    }
  }, [token, router]);

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return response.json();
    },
    enabled: !!token,
  });

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterPriority
        ? task.priority === Number.parseInt(filterPriority)
        : true)
  );

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Please log in to continue
          </h2>
          <a
            href="/login"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <TaskStatistics tasks={tasks} />
            <TaskForm />
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full p-3 border border-gray-700 rounded mt-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
              </select>
            </div>
            <TaskList tasks={filteredTasks} />
          </div>
          <div>
            <TaskCalendar tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}
