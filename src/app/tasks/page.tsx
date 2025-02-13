"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useStore";
import type { Task } from "@/types";
import {
  PlusCircle,
  Calendar,
  Clock,
  AlertCircle,
  Check,
  Trash,
  Edit,
} from "lucide-react";
import TaskForm from "@/components/TaskForm";
import { toast } from "sonner";
import TaskEditModal from "@/components/TaskEditModal";

export default function Tasks() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

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

  const markTaskCompleted = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "completed",
          completed: true,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task marked as completed!");
    },
    onError: (error) => {
      toast.error("Failed to complete task: " + error.message);
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete task: " + error.message);
    },
  });

  const updateTask = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Task> }) => {
      const response = await fetch(`/api/tasks/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data.updates),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditingTask(null);
      toast.success("Task updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update task: " + error.message);
    },
  });

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    return !task.completed;
  });

  const handleEditSubmit = (updatedTask: Partial<Task>) => {
    if (editingTask) {
      updateTask.mutate({
        id: editingTask.id,
        updates: updatedTask,
      });
    }
  };

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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            {showTaskForm ? "Close Form" : "New Task"}
          </button>
        </div>

        {showTaskForm && <TaskForm />}

        <div className="mb-6">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="grid gap-4 mb-8">
          {filteredTasks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No tasks found for this filter
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-white">
                      {task.title}
                    </h3>
                    <p className="text-gray-300 mt-1">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.priority === 3 && (
                      <span className="bg-red-900 text-red-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                        <AlertCircle size={16} />
                        High
                      </span>
                    )}
                    {task.priority === 2 && (
                      <span className="bg-yellow-900 text-yellow-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                        <Clock size={16} />
                        Medium
                      </span>
                    )}
                    {task.priority === 1 && (
                      <span className="bg-green-900 text-green-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                        <Calendar size={16} />
                        Low
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="text-gray-300">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 rounded-full ${
                        task.completed
                          ? "bg-green-900 text-green-100"
                          : "bg-yellow-900 text-yellow-100"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </div>
                    {!task.completed && (
                      <button
                        onClick={() => markTaskCompleted.mutate(task.id)}
                        className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-full hover:bg-green-700"
                      >
                        <Check size={16} />
                        Mark Complete
                      </button>
                    )}
                    <button
                      onClick={() => setEditingTask(task)}
                      className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700"
                      title="Edit Task"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this task?")
                        ) {
                          deleteTask.mutate(task.id);
                        }
                      }}
                      className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-full hover:bg-red-700"
                      title="Delete Task"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task Edit Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
