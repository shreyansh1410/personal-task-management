import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useStore";
import type { TaskPriority, Project } from "@/types";
import { toast } from "sonner";

interface TaskFormProps {
  projectId?: number;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export default function TaskForm({ projectId }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(1);
  const [dueDate, setDueDate] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<
    number | undefined
  >(projectId);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const { data } = useQuery<ApiResponse<Project[]>>({
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
      return response.json();
    },
    enabled: !!token,
  });

  const projects = data?.data ?? [];

  const createTask = useMutation({
    mutationFn: async (taskData: {
      title: string;
      description: string;
      priority: TaskPriority;
      dueDate: string;
      projectId?: number;
    }) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Failed to create task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ["project-tasks", projectId],
        });
      }
      setTitle("");
      setDescription("");
      setPriority(1);
      setDueDate("");
      setSelectedProjectId(projectId);
      toast.success("Task created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create task: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask.mutate({
      title,
      description,
      priority,
      dueDate,
      projectId: selectedProjectId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6"
    >
      <div className="grid gap-4 mb-6">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(Number(e.target.value) as TaskPriority)
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {!projectId && (
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">
                Project (Optional)
              </label>
              <select
                value={selectedProjectId || ""}
                onChange={(e) =>
                  setSelectedProjectId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">No Project</option>
                {projects.map((project: Project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Create Task
        </button>
      </div>
    </form>
  );
}
