import { Calendar, AlertCircle, Clock } from "lucide-react";
import type { Task } from "@/types";
import { ApiResponse } from "@/types";

interface TaskListProps {
  tasks: Task[] | ApiResponse<Task[]>;
  projectView?: boolean;
}

export default function TaskList({ tasks = [], projectView }: TaskListProps) {
  const taskList = Array.isArray(tasks) ? tasks : tasks?.data ?? [];

  return (
    <div className="space-y-4">
      {taskList.map((task: Task) => (
        <div
          key={task.id}
          className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {task.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {task.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {task.priority === 3 && (
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  <AlertCircle size={16} />
                  High
                </span>
              )}
              {task.priority === 2 && (
                <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  <Clock size={16} />
                  Medium
                </span>
              )}
              {task.priority === 1 && (
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  <Calendar size={16} />
                  Low
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Calendar size={16} />
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full ${
                  task.completed
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                    : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>
          </div>
        </div>
      ))}
      {taskList.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No tasks found {projectView ? "in this project" : ""}
        </div>
      )}
    </div>
  );
}