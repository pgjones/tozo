import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

interface ILink {
  label: string;
  to: string;
  state?: any;
}

interface IProps {
  disabled: boolean;
  isSubmitting: boolean;
  label: string;
  links?: ILink[];
}

const FormActions = ({ disabled, isSubmitting, label, links }: IProps) => (
  <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
    <LoadingButton
      disabled={disabled}
      loading={isSubmitting}
      type="submit"
      variant="contained"
    >
      {label}
    </LoadingButton>
    {(links ?? []).map(({ label, to, state }) => (
      <Button
        component={Link}
        key={to}
        state={state}
        to={to}
        variant="outlined"
      >
        {label}
      </Button>
    ))}
  </Stack>
);

export default FormActions;
