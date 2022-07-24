import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FieldHookConfig, useField } from "formik";

import { combineHelperText } from "src/utils";

const DateField = (props: FieldHookConfig<Date | null> & TextFieldProps) => {
  const [field, meta, helpers] = useField<Date | null>(props);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={props.label}
        value={field.value}
        onChange={(newValue) => helpers.setValue(newValue)}
        renderInput={(params) => (
          <TextField
            fullWidth={props.fullWidth}
            {...params}
            helperText={combineHelperText(props.helperText, meta)}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DateField;
