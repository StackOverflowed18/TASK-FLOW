import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storageService } from "./services/storage";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: storageService.getTasks,
  });

  const addMutation = useMutation({
    mutationFn: storageService.addTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return (
    <div className="p-4 w-[350px] bg-gray-900 text-white">
      <h1 className="text-xl font-bold mb-4">TaskFlow</h1>

      <TaskForm onCreate={(task) => addMutation.mutate(task)} />
      <TaskList tasks={tasks} />
    </div>
  );
}