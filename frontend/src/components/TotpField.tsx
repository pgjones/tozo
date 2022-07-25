import TextField, { TextFieldProps } from "@mui/material/TextField";
import { FieldHookConfig, useField } from "formik";

import { combineHelperText } from "src/utils";

const TotpField = (props: FieldHookConfig<string> & TextFieldProps) => {
  const [field, meta] = useField<string>(props);

  return (
    <TextField
      {...props}
      autoComplete="one-time-code"
      error={Boolean(meta.error) && meta.touched}
      helperText={combineHelperText(props.helperText, meta)}
      inputProps={{ inputMode: "numeric", maxLength: 6, pattern: "[0-9]*" }}
      margin="normal"
      type="text"
      {...field}
    />
  );
};

export default TotpField;
