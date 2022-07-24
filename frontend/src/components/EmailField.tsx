import TextField, { TextFieldProps } from "@mui/material/TextField";
import { FieldHookConfig, useField } from "formik";

import { combineHelperText } from "src/utils";

const EmailField = (props: FieldHookConfig<string> & TextFieldProps) => {
  const [field, meta] = useField<string>(props);

  return (
    <TextField
      {...props}
      autoComplete="email"
      error={Boolean(meta.error) && meta.touched}
      helperText={combineHelperText(props.helperText, meta)}
      margin="normal"
      type="email"
      {...field}
    />
  );
};

export default EmailField;
