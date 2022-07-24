import { FieldMetaProps } from "formik";
import React from "react";

export const combineHelperText = <T,>(
  helperText: React.ReactNode | string | undefined,
  meta: FieldMetaProps<T>,
) => {
  if (Boolean(meta.error) && meta.touched) {
    if (typeof helperText === "string") {
      return `${meta.error}. ${helperText ?? ""}`;
    } else {
      return (
        <>
          {meta.error}. {helperText}
        </>
      );
    }
  } else {
    return helperText;
  }
};
