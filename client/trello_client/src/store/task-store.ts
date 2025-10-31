// File: client/trello_client/src/store/task-store.ts

import { create } from "zustand";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: "To Do" | "In Progress" | "Done";
  createdAt: string;
  updatedAt: string;
};

type TaskStore = {
  tasks: { [key: string]: Task[] };
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (title: string, description: string) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: {
    "To Do": [],
    "In Progress": [],
    Done: [],
  },
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      const data = await response.json();
      set({ tasks: data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      set({ isLoading: false });
    }
  },

  createTask: async (title: string, description: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        await get().fetchTasks();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  },

  updateTask: async (id: number, updates: Partial<Task>) => {
    const currentTasks = get().tasks;

    // Find the task and its current status
    let targetTask: Task | null = null;
    let oldStatus: "To Do" | "In Progress" | "Done" | null = null;

    for (const status in currentTasks) {
      const task = currentTasks[status].find((t) => t.id === id);
      if (task) {
        targetTask = task;
        oldStatus = status as "To Do" | "In Progress" | "Done";
        break;
      }
    }

    if (!targetTask || !oldStatus) return;

    // Optimistic update
    const updatedTask = {
      ...targetTask,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const newStatus = updates.status || oldStatus;
    const newTasks = { ...currentTasks };

    // Remove from old status
    newTasks[oldStatus] = newTasks[oldStatus].filter((t) => t.id !== id);

    // Add to new status
    newTasks[newStatus] = [...newTasks[newStatus], updatedTask];

    // Update state immediately
    set({ tasks: newTasks });

    // Update on server in background
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        // Revert on error
        console.error("Failed to update task");
        set({ tasks: currentTasks });
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      // Revert on error
      set({ tasks: currentTasks });
    }
  },

  deleteTask: async (id: number) => {
    const currentTasks = get().tasks;

    // Optimistic delete
    const newTasks = { ...currentTasks };
    for (const status in newTasks) {
      newTasks[status] = newTasks[status].filter((t) => t.id !== id);
    }

    set({ tasks: newTasks });

    // Delete on server in background
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Revert on error
        console.error("Failed to delete task");
        set({ tasks: currentTasks });
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      // Revert on error
      set({ tasks: currentTasks });
    }
  },
}));
