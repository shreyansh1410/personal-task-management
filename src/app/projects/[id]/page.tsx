"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useStore";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import type { Task } from "@/types";

export default function ProjectDetails() {
  const params = useParams();
  const projectId = params.id;
  const token = useAuthStore((state) => state.token);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
    enabled: !!token && !!projectId,
  });

  const { data: tasksResponse = { data: [] } } = useQuery<
    { data: Task[] },
    Error
  >({
    queryKey: ["project-tasks", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
    enabled: !!token && !!projectId,
  });

  const tasks = tasksResponse.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {project?.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {project?.description}
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Project Tasks
        </h2>
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showTaskForm ? "Close Form" : "Add Task"}
        </button>
      </div>

      {showTaskForm && <TaskForm projectId={Number(projectId)} />}
      <TaskList tasks={tasks} projectView />
    </div>
  );
}
