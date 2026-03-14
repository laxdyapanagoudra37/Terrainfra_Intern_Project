export type TaskStatus = "Pending" | "In Progress" | "Completed";
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
}
