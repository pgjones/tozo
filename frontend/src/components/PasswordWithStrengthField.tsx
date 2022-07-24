import LinearProgress from "@mui/material/LinearProgress";
import { TextFieldProps } from "@mui/material/TextField";
import { FieldHookConfig, useField } from "formik";
import zxcvbn from "zxcvbn";

import PasswordField from "src/components/PasswordField";

const scoreToDisplay = (score: number) => {
  let progressColor = "other.red";
  let helperText = "Weak";

  switch (score) {
    case 25:
      progressColor = "other.pink";
      break;
    case 50:
      progressColor = "other.orange";
      break;
    case 75:
      progressColor = "other.yellow";
      helperText = "Good";
      break;
    case 100:
      progressColor = "other.green";
      helperText = "Strong";
      break;
  }
  return [progressColor, helperText];
};

const PasswordWithStrengthField = (
  props: FieldHookConfig<string> & TextFieldProps,
) => {
  const [field] = useField<string>(props);
  const result = zxcvbn(field.value ?? "");
  const score = (result.score * 100) / 4;

  const [progressColor, helperText] = scoreToDisplay(score);

  return (
    <>
      <PasswordField {...props} helperText={helperText} />
      <LinearProgress
        sx={{
          "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: progressColor,
          },
          backgroundColor: "action.selected",
          margin: "0 4px 24px 4px",
        }}
        value={score}
        variant="determinate"
      />
    </>
  );
};

export default PasswordWithStrengthField;
