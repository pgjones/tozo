import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import { useContext } from "react";
import { useParams } from "react-router";
import { Navigate } from "react-router-dom";

import { useQuery } from "src/query";
import { ToastContext } from "src/ToastContext";

interface IParams {
  token?: string;
}

const ConfirmEmail = () => {
  const { addToast } = useContext(ToastContext);
  const params = useParams() as IParams;
  const token = params.token ?? "";
  const { isLoading } = useQuery(
    ["Email"],
    async () => await axios.put("/members/email/", { token }),
    {
      onError: (error: any) => {
        if (error.response?.status === 400) {
          if (error.response?.data.code === "TOKEN_INVALID") {
            addToast("Invalid token", "error");
          } else if (error.response?.data.code === "TOKEN_EXPIRED") {
            addToast("Token expired", "error");
          }
        } else {
          addToast("Try again", "error");
        }
      },
      onSuccess: () => addToast("Thanks", "success"),
    },
  );

  if (isLoading) {
    return <LinearProgress />;
  } else {
    return <Navigate to="/" />;
  }
};

export default ConfirmEmail;
