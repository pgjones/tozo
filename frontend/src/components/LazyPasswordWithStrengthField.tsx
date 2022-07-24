import { TextFieldProps } from "@mui/material/TextField";
import { lazy, Suspense } from "react";
import { FieldHookConfig } from "formik";

import PasswordField from "src/components/PasswordField";

const PasswordWithStrengthField = lazy(
  () => import("src/components/PasswordWithStrengthField"),
);

const LazyPasswordWithStrengthField = (
  props: FieldHookConfig<string> & TextFieldProps,
) => (
  <Suspense fallback={<PasswordField {...props} />}>
    <PasswordWithStrengthField {...props} />
  </Suspense>
);

export default LazyPasswordWithStrengthField;
