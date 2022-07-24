import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

import { Todo } from "src/models";
import { useMutation, useQuery } from "src/query";

export const STALE_TIME = 1000 * 60 * 5; // 5 mins

export const useTodosQuery = () =>
  useQuery<Todo[]>(
    ["todos"],
    async () => {
      const response = await axios.get("/todos/");
      return response.data.todos.map((json: any) => new Todo(json));
    },
    { staleTime: STALE_TIME },
  );

export const useTodoQuery = (id: number) => {
  const queryClient = useQueryClient();
  return useQuery<Todo>(
    ["todos", id.toString()],
    async () => {
      const response = await axios.get(`/todos/${id}/`);
      return new Todo(response.data);
    },
    {
      initialData: () => {
        return queryClient
          .getQueryData<Todo[]>(["todos"])
          ?.filter((todo: Todo) => todo.id === id)[0];
      },
      staleTime: STALE_TIME,
    },
  );
};

export interface ITodoData {
  complete: boolean;
  due: Date | null;
  task: string;
}

export const useCreateTodoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: ITodoData) => await axios.post("/todos/", data),
    {
      onSuccess: () => queryClient.invalidateQueries(["todos"]),
    },
  );
};

export const useEditTodoMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: ITodoData) => await axios.put(`/todos/${id}/`, data),
    {
      onSuccess: () => queryClient.invalidateQueries(["todos"]),
    },
  );
};

export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => await axios.delete(`/todos/${id}/`),
    {
      onSuccess: () => queryClient.invalidateQueries(["todos"]),
    },
  );
};
