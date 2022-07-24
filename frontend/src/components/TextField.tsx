import MUITextField, { TextFieldProps } from "@mui/material/TextField";
import { FieldHookConfig, useField } from "formik";

import { combineHelperText } from "src/utils";

const TextField = (props: FieldHookConfig<string> & TextFieldProps) => {
  const [field, meta] = useField<string>(props);

  return (
    <MUITextField
      {...props}
      error={Boolean(meta.error) && meta.touched}
      helperText={combineHelperText(props.helperText, meta)}
      margin="normal"
      type="text"
      {...field}
    />
  );
};

export default TextField;
