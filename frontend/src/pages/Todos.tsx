import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import AddIcon from "@mui/icons-material/Add";
import { Link, Navigate } from "react-router-dom";

import Todo from "src/components/Todo";
import { useTodosQuery } from "src/queries";

const Todos = () => {
  const { data: todos } = useTodosQuery();

  if (todos?.length === 0) {
    return <Navigate to="/todos/new/" />;
  } else {
    return (
      <>
        <List>
          {todos !== undefined
            ? todos.map((todo) => <Todo key={todo.id} todo={todo} />)
            : [1, 2, 3].map((id) => <Todo key={-id} />)}
        </List>
        <Fab
          component={Link}
          sx={{
            bottom: (theme) => theme.spacing(2),
            position: "fixed",
            right: (theme) => theme.spacing(2),
          }}
          to="/todos/new/"
        >
          <AddIcon />
        </Fab>
      </>
    );
  }
};

export default Todos;
