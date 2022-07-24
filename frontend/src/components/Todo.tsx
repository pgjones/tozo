import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import { Todo as TodoModel } from "src/models";
import { useDeleteTodoMutation } from "src/queries";

interface IProps {
  todo?: TodoModel;
}

const Todo = ({ todo }: IProps) => {
  const { mutateAsync: deleteTodo } = useDeleteTodoMutation();
  let secondary;
  if (todo === undefined) {
    secondary = <Skeleton width="200px" />;
  } else if (todo.due !== null) {
    secondary = format(todo.due, "P");
  }
  return (
    <ListItem
      secondaryAction={
        <IconButton
          disabled={todo === undefined}
          edge="end"
          onClick={() => deleteTodo(todo?.id!)}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemButton
        component={Link}
        disabled={todo === undefined}
        to={`/todos/${todo?.id}/`}
      >
        <ListItemIcon>
          <Checkbox
            checked={todo?.complete ?? false}
            disabled
            disableRipple
            edge="start"
            tabIndex={-1}
          />
        </ListItemIcon>
        <ListItemText
          primary={todo?.task ?? <Skeleton />}
          secondary={secondary}
        />
      </ListItemButton>
    </ListItem>
  );
};
export default Todo;
