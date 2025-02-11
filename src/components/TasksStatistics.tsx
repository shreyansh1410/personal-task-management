import type React from "react";
import type { Task } from "@/types";

interface TaskStatisticsProps {
  tasks: Task[];
}

const TaskStatistics: React.FC<TaskStatisticsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const upcomingDeadlines = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const threeDaysFromNow = new Date(today.setDate(today.getDate() + 3));
    return dueDate <= threeDaysFromNow && task.status !== "completed";
  }).length;

  return (
    <div className="mb-4 p-4 bg-gray-700 shadow rounded">
      <h2 className="text-xl font-bold mb-2">Task Statistics</h2>
      <p>Total Tasks: {totalTasks}</p>
      <p>Completed Tasks: {completedTasks}</p>
      <p>
        Completion Rate:{" "}
        {totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0}%
      </p>
      <p>Upcoming Deadlines (3 days): {upcomingDeadlines}</p>
    </div>
  );
};

export default TaskStatistics;
