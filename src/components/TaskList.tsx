import type React from "react";
import type { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="p-2 bg-gray-700 shadow rounded">
          <h3 className="font-bold">{task.title}</h3>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
