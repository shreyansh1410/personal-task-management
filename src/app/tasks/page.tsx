"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useStore";
import type { Task } from "@/types";
import { PlusCircle, Calendar, Clock, AlertCircle } from "lucide-react";

export default function Tasks() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const token = useAuthStore((state) => state.token);

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

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.status === "completed";
    return task.status === "pending";
  });

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to continue</h2>
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-700 underline"
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <PlusCircle size={20} />
          New Task
        </button>
      </div>

      <div className="mb-6">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-gray-600 mt-1">{task.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {task.priority === 3 && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                    <AlertCircle size={16} />
                    High
                  </span>
                )}
                {task.priority === 2 && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                    <Clock size={16} />
                    Medium
                  </span>
                )}
                {task.priority === 1 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                    <Calendar size={16} />
                    Low
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
              <div
                className={`px-2 py-1 rounded-full ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}