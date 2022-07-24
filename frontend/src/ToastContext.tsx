import { AlertColor } from "@mui/material/Alert";

import React, { createContext, useState } from "react";

export interface IToast {
  category?: AlertColor;
  key: number;
  message: string;
}

interface IToastContext {
  addToast: (message: string, category: AlertColor | undefined) => void;
  setToasts: React.Dispatch<React.SetStateAction<IToast[]>>;
  toasts: IToast[];
}

export const ToastContext = createContext<IToastContext>({
  addToast: () => {},
  setToasts: () => {},
  toasts: [],
});

interface IProps {
  children?: React.ReactNode;
}

export const ToastContextProvider = ({ children }: IProps) => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const addToast = (
    message: string,
    category: AlertColor | undefined = undefined,
  ) => {
    setToasts((prev) => [
      ...prev,
      {
        category,
        key: new Date().getTime(),
        message,
      },
    ]);
  };

  return (
    <ToastContext.Provider value={{ addToast, setToasts, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};
