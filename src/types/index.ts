export type TaskPriority = 1 | 2 | 3;
export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  completedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
