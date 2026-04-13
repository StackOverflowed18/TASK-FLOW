import { storageService } from "../services/storage";
import { useQueryClient } from "@tanstack/react-query";
import type { Task } from "../types/task";

interface Props {
  task: Task;
}

export default function TaskItem({ task }: Props) {
  const queryClient = useQueryClient();

  const toggleStatus = async () => {
    await storageService.updateTask({
      ...task,
      status: task.status === "active" ? "completed" : "active",
    });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const deleteTask = async () => {
    await storageService.deleteTask(task.id);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return (
    <div className="p-3 bg-gray-800 rounded flex justify-between">
      <span
        className={task.status === "completed" ? "line-through" : ""}
      >
        {task.title}
      </span>

      <div className="space-x-2">
        <button onClick={toggleStatus}>✔</button>
        <button onClick={deleteTask}>✖</button>
      </div>
    </div>
  );
}