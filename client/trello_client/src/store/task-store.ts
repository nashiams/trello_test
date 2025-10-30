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
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        await get().fetchTasks();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  },

  deleteTask: async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await get().fetchTasks();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  },
}));
