import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FieldHookConfig, useField } from "formik";
import { useState } from "react";

import { combineHelperText } from "src/utils";

const PasswordField = (props: FieldHookConfig<string> & TextFieldProps) => {
  const [field, meta] = useField<string>(props);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((value) => !value)}
              tabIndex={-1}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      error={Boolean(meta.error) && meta.touched}
      helperText={combineHelperText(props.helperText, meta)}
      margin="normal"
      type={showPassword ? "text" : "password"}
      {...field}
    />
  );
};

export default PasswordField;
