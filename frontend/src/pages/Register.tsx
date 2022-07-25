import axios from "axios";
import { Form, Formik, FormikHelpers } from "formik";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import * as yup from "yup";

import EmailField from "src/components/EmailField";
import FormActions from "src/components/FormActions";
import LazyPasswordWithStrengthField from "src/components/LazyPasswordWithStrengthField";
import Title from "src/components/Title";
import { ToastContext } from "src/ToastContext";
import { useMutation } from "src/query";

interface IForm {
  email: string;
  password: string;
}

const useRegister = () => {
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const { mutateAsync: register } = useMutation(
    async (data: IForm) => await axios.post("/members/", data),
  );

  return async (data: IForm, { setFieldError }: FormikHelpers<IForm>) => {
    try {
      await register(data);
      addToast("Registered", "success");
      navigate("/login/", { state: { email: data.email } });
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response?.data.code === "WEAK_PASSWORD"
      ) {
        setFieldError("password", "Password is too weak");
      } else if (
        error.response?.status === 400 &&
        error.response?.data.code === "INVALID_DOMAIN"
      ) {
        setFieldError("email", "Invalid email domain");
      } else {
        addToast("Try again", "error");
      }
    }
  };
};

const validationSchema = yup.object({
  email: yup.string().email("Email invalid").required("Required"),
  password: yup.string().required("Required"),
});

const Register = () => {
  const location = useLocation();
  const onSubmit = useRegister();

  return (
    <>
      <Title title="Register" />
      <Formik<IForm>
        initialValues={{
          email: (location.state as any)?.email ?? "",
          password: "",
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ dirty, isSubmitting, values }) => (
          <Form>
            <EmailField fullWidth label="Email" name="email" required />
            <LazyPasswordWithStrengthField
              autoComplete="new-password"
              fullWidth
              label="Password"
              name="password"
              required
            />
            <FormActions
              disabled={!dirty}
              isSubmitting={isSubmitting}
              label="Register"
              links={[
                {
                  label: "Login",
                  to: "/login/",
                  state: { email: values.email },
                },
                {
                  label: "Reset password",
                  to: "/forgotten-password/",
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

export default Register;
