import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import TodoForm from "src/components/TodoForm";
import Title from "src/components/Title";
import type { ITodoData } from "src/queries";
import { useCreateTodoMutation } from "src/queries";
import { ToastContext } from "src/ToastContext";

const CreateTodo = () => {
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const { mutateAsync: createTodo } = useCreateTodoMutation();

  const onSubmit = async (data: ITodoData) => {
    try {
      await createTodo(data);
      navigate("/");
    } catch {
      addToast("Try Again", "error");
    }
  };

  return (
    <>
      <Title title="Create a Todo" />
      <TodoForm
        initialValues={{ complete: false, due: null, task: "" }}
        label="Create"
        onSubmit={onSubmit}
      />
    </>
  );
};

export default CreateTodo;
