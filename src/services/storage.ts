import type { Task } from "../types/task";

const STORAGE_KEY = "tasks";

export const storageService = {
  async getTasks(): Promise<Task[]> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        [STORAGE_KEY],
        (result: { [key: string]: Task[] }) => {
          resolve(result[STORAGE_KEY] || []);
        }
      );
    });
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [STORAGE_KEY]: tasks }, () => {
        resolve();
      });
    });
  },

  async addTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    tasks.push(task);
    await this.saveTasks(tasks);
  },

  async updateTask(updatedTask: Task): Promise<void> {
    const tasks = await this.getTasks();
    const updated = tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    await this.saveTasks(updated);
  },

  async deleteTask(id: string): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    await this.saveTasks(filtered);
  },

  async clearCompleted(): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter((t) => t.status !== "completed");
    await this.saveTasks(filtered);
  },
};