import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { FieldHookConfig, useField } from "formik";

import { combineHelperText } from "src/utils";

type IProps = FieldHookConfig<boolean> & {
  fullWidth?: boolean;
  helperText?: string;
  label: string;
  required?: boolean;
};

const CheckboxField = (props: IProps) => {
  const [field, meta] = useField<boolean>(props);

  return (
    <FormControl
      component="fieldset"
      error={Boolean(meta.error) && meta.touched}
      fullWidth={props.fullWidth}
      margin="normal"
      required={props.required}
    >
      <FormControlLabel
        control={<Checkbox {...field} checked={field.value} />}
        label={props.label}
      />
      <FormHelperText>
        {combineHelperText(props.helperText, meta)}
      </FormHelperText>
    </FormControl>
  );
};

export default CheckboxField;
