import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik, FormikHelpers } from "formik";
import { useContext } from "react";
import { QRCodeSVG } from "qrcode.react";
import * as yup from "yup";

import FormActions from "src/components/FormActions";
import Title from "src/components/Title";
import TotpField from "src/components/TotpField";
import { useMutation, useQuery } from "src/query";
import { ToastContext } from "src/ToastContext";

const useActivateMFA = (): [() => Promise<void>, boolean] => {
  const queryClient = useQueryClient();

  const { mutateAsync: activate, isLoading } = useMutation(
    async () => await axios.post("/members/mfa/"),
    {
      onSuccess: () => queryClient.invalidateQueries(["mfa"]),
    },
  );

  return [
    async () => {
      await activate();
    },
    isLoading,
  ];
};

interface IForm {
  token: string;
}

const useConfirmMFA = () => {
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();

  const { mutateAsync: confirm } = useMutation(
    async (data: IForm) => await axios.put("/members/mfa/", data),
    {
      onSuccess: () => queryClient.invalidateQueries(["mfa"]),
    },
  );

  return async (data: IForm, { setFieldError }: FormikHelpers<IForm>) => {
    try {
      await confirm(data);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setFieldError("token", "Invalid code");
      } else {
        addToast("Try again", "error");
      }
    }
  };
};

const validationSchema = yup.object({
  token: yup.string().required("Required"),
});

const MFA = () => {
  const { data } = useQuery(["mfa"], async () => {
    const response = await axios.get("/members/mfa/");
    return response.data;
  });
  const [activate, isLoading] = useActivateMFA();
  const onSubmit = useConfirmMFA();

  let content = <Skeleton />;
  if (data?.state === "ACTIVE") {
    content = <Typography variant="body1">MFA Active</Typography>;
  } else if (data?.state === "INACTIVE") {
    content = (
      <LoadingButton loading={isLoading} onClick={activate}>
        Activate
      </LoadingButton>
    );
  } else if (data !== undefined) {
    content = (
      <>
        <QRCodeSVG value={data.totpUri} />
        <Formik<IForm>
          initialValues={{ token: "" }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ dirty, isSubmitting }) => (
            <Form>
              <TotpField
                fullWidth={true}
                label="One time code"
                name="token"
                required={true}
              />
              <FormActions
                disabled={!dirty}
                isSubmitting={isSubmitting}
                label="Confirm"
                links={[{ label: "Back", to: "/" }]}
              />
            </Form>
          )}
        </Formik>
      </>
    );
  }

  return (
    <>
      <Title title="Multi-Factor Authentication" />
      {content}
    </>
  );
};

export default MFA;
