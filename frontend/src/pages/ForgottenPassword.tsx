import axios from "axios";
import { Form, Formik } from "formik";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import * as yup from "yup";

import EmailField from "src/components/EmailField";
import FormActions from "src/components/FormActions";
import Title from "src/components/Title";
import { useMutation } from "src/query";
import { ToastContext } from "src/ToastContext";

interface IForm {
  email: string;
}

const useForgottenPassword = () => {
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);

  const { mutateAsync: forgottenPassword } = useMutation(
    async (data: IForm) =>
      await axios.post("/members/forgotten-password/", data),
  );

  return async (data: IForm) => {
    try {
      await forgottenPassword(data);
      addToast("Reset link sent to your email", "success");
      navigate("/login/");
    } catch {
      addToast("Try again", "error");
    }
  };
};

const validationSchema = yup.object({
  email: yup.string().email("Email invalid").required("Required"),
});

const ForgottenPassword = () => {
  const onSubmit = useForgottenPassword();
  const location = useLocation();

  return (
    <>
      <Title title="Forgotten password" />
      <Formik<IForm>
        initialValues={{
          email: (location.state as any)?.email ?? "",
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ dirty, isSubmitting, values }) => (
          <Form>
            <EmailField fullWidth label="Email" name="email" required />
            <FormActions
              disabled={!dirty}
              isSubmitting={isSubmitting}
              label="Send email"
              links={[
                {
                  label: "Login",
                  to: "/login/",
                  state: { email: values.email },
                },
                {
                  label: "Register",
                  to: "/register/",
                  state: { email: values.email },
                },
              ]}
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ForgottenPassword;
