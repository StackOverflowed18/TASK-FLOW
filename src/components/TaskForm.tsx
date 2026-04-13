import { useState } from "react";
// import { Task } from "../types/task";
import type { Task } from "../types/task";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onCreate: (task: Task) => void;
}

export default function TaskForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!title) return;

    const newTask: Task = {
      id: uuidv4(),
      title,
      priority: "medium",
      status: "active",
      createdAt: Date.now(),
    };

    onCreate(newTask);
    setTitle("");
  };

  return (
    <div className="mb-3">
      <input
        className="w-full p-2 rounded bg-gray-800"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Task..."
      />
      <button
        onClick={handleSubmit}
        className="mt-2 w-full bg-blue-600 p-2 rounded"
      >
        Add Task
      </button>
    </div>
  );
}