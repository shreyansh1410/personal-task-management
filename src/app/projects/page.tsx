"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useStore";
import { PlusCircle, Folder, Settings, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Project {
  id: number;
  name: string;
  description: string;
  userId: number;
  createdAt: string;
  taskCount?: number;
}

export default function Projects() {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const result = await response.json();
      return Array.isArray(result.data) ? result.data : []; // Ensure we always return an array
    },
    enabled: !!token,
  });

  const createProject = useMutation({
    mutationFn: async (projectData: { name: string; description: string }) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowProjectForm(false);
      setName("");
      setDescription("");
      toast.success("Project created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create project: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate({ name, description });
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Please log in to continue
          </h2>
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <button
            onClick={() => setShowProjectForm(!showProjectForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            {showProjectForm ? "Close Form" : "New Project"}
          </button>
        </div>

        {showProjectForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={createProject.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {createProject.isPending ? "Creating..." : "Create Project"}
            </button>
          </form>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Loading projects...
            </p>
          </div>
        )}

        {isError && (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">
              Error: {error?.message}
            </p>
          </div>
        )}

        {!isLoading && !isError && projects.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No projects found. Create your first project!
            </p>
          </div>
        )}

        {!isLoading && !isError && projects.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Folder
                      className="text-blue-600 dark:text-blue-400"
                      size={24}
                    />
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                  </div>
                  <Settings
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    size={20}
                  />
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    View Tasks
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
