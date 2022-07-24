import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { useContext, useEffect, useState } from "react";

import { ToastContext, IToast } from "src/ToastContext";

const Toasts = () => {
  const { toasts, setToasts } = useContext(ToastContext);
  const [open, setOpen] = useState(false);
  const [currentToast, setCurrentToast] = useState<IToast | undefined>();

  useEffect(() => {
    if (!open && toasts.length) {
      setCurrentToast(toasts[0]);
      setToasts((prev) => prev.slice(1));
      setOpen(true);
    }
  }, [open, setCurrentToast, setOpen, setToasts, toasts]);

  const onClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== "clickaway") {
      setOpen(false);
    }
  };

  return (
    <Snackbar
      anchorOrigin={{
        horizontal: "center",
        vertical: "top",
      }}
      autoHideDuration={6000}
      key={currentToast?.key}
      onClose={onClose}
      open={open}
      TransitionProps={{
        onExited: () => setCurrentToast(undefined),
      }}
    >
      <Alert onClose={onClose} severity={currentToast?.category}>
        {currentToast?.message}
      </Alert>
    </Snackbar>
  );
};

export default Toasts;
