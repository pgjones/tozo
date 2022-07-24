import Skeleton from "@mui/material/Skeleton";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router";

import TodoForm from "src/components/TodoForm";
import Title from "src/components/Title";
import type { ITodoData } from "src/queries";
import { useEditTodoMutation, useTodoQuery } from "src/queries";
import { ToastContext } from "src/ToastContext";

interface Iparams {
  id: string;
}

const EditTodo = () => {
  const navigate = useNavigate();
  const params = useParams<keyof Iparams>() as Iparams;
  const todoId = parseInt(params.id, 10);
  const { addToast } = useContext(ToastContext);
  const { data: todo } = useTodoQuery(todoId);
  const { mutateAsync: editTodo } = useEditTodoMutation(todoId);

  const onSubmit = async (data: ITodoData) => {
    try {
      await editTodo(data);
      navigate("/");
    } catch {
      addToast("Try again", "error");
    }
  };

  return (
    <>
      <Title title="Edit todo" />
      {todo === undefined ? (
        <Skeleton height="80px" />
      ) : (
        <TodoForm
          initialValues={{
            complete: todo.complete,
            due: todo.due,
            task: todo.task,
          }}
          label="Edit"
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};

export default EditTodo;
