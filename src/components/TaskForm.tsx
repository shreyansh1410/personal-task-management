import type React from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useStore";
import type { Task, TaskPriority } from "../types";

interface CreateTaskDTO {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

const TaskForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("1");
  const [dueDate, setDueDate] = useState("");
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  // Get current date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  const { mutate } = useMutation<Task, Error, CreateTaskDTO>({
    mutationFn: async (newTask: CreateTaskDTO) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
      setDescription("");
      setPriority("1");
      setDueDate("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      title,
      description,
      priority: Number(priority) as TaskPriority,
      dueDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-700 shadow rounded">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="text-black w-full p-2 mb-2 border rounded"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        className="text-black w-full p-2 mb-2 border rounded"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="text-black w-full p-2 mb-2 border rounded"
      >
        <option value="1">Low</option>
        <option value="2">Medium</option>
        <option value="3">High</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        min={today}
        className="text-black w-full p-2 mb-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;