import axios from "axios";
import { Form, Formik, FormikHelpers } from "formik";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import FormActions from "src/components/FormActions";
import LazyPasswordWithStrengthField from "src/components/LazyPasswordWithStrengthField";
import PasswordField from "src/components/PasswordField";
import Title from "src/components/Title";
import { ToastContext } from "src/ToastContext";
import { useMutation } from "src/query";

interface IForm {
  currentPassword: string;
  newPassword: string;
}

const useChangePassword = () => {
  const { addToast } = useContext(ToastContext);
  const { mutateAsync: changePassword } = useMutation(
    async (data: IForm) => await axios.put("/members/password/", data),
  );
  const navigate = useNavigate();

  return async (data: IForm, { setFieldError }: FormikHelpers<IForm>) => {
    try {
      await changePassword(data);
      addToast("Changed", "success");
      navigate("/");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setFieldError("newPassword", "Password is too weak");
        } else if (error.response?.status === 401) {
          setFieldError("currentPassword", "Incorrect password");
        }
      } else {
        addToast("Try again", "error");
      }
    }
  };
};

const validationSchema = yup.object({
  currentPassword: yup.string().required("Required"),
  newPassword: yup.string().required("Required"),
});

const ChangePassword = () => {
  const onSubmit = useChangePassword();

  return (
    <>
      <Title title="Change Password" />
      <Formik<IForm>
        initialValues={{ currentPassword: "", newPassword: "" }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ dirty, isSubmitting }) => (
          <Form>
            <PasswordField
              autoComplete="current-password"
              fullWidth
              label="Current password"
              name="currentPassword"
              required
            />
            <LazyPasswordWithStrengthField
              autoComplete="new-password"
              fullWidth
              label="New password"
              name="newPassword"
              required
            />
            <FormActions
              disabled={!dirty}
              isSubmitting={isSubmitting}
              label="Change"
              links={[{ label: "Back", to: "/" }]}
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ChangePassword;
