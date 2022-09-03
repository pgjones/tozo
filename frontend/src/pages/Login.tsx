import axios from "axios";
import { Form, Formik, FormikHelpers } from "formik";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import * as yup from "yup";

import { AuthContext } from "src/AuthContext";
import BookIntro from "src/components/BookIntro";
import EmailField from "src/components/EmailField";
import FormActions from "src/components/FormActions";
import PasswordField from "src/components/PasswordField";
import Title from "src/components/Title";
import TotpField from "src/components/TotpField";
import { ToastContext } from "src/ToastContext";
import { useMutation } from "src/query";

interface IForm {
  email: string;
  password: string;
  token: string;
}

const useLogin = (): [
  (data: IForm, helpers: FormikHelpers<IForm>) => Promise<void>,
  boolean,
] => {
  const [requiresMFA, setRequiresMFA] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const { setAuthenticated } = useContext(AuthContext);
  const { mutateAsync: login } = useMutation(
    async (data: IForm) => await axios.post("/sessions/", data),
  );

  return [
    async (data: IForm, { setFieldError }: FormikHelpers<IForm>) => {
      const loginData: any = {
        email: data.email,
        password: data.password,
      };
      if (requiresMFA) {
        loginData["token"] = data.token;
      }
      try {
        await login(loginData);
        setAuthenticated(true);
        navigate((location.state as any)?.from ?? "/");
      } catch (error: any) {
        if (error.response?.status === 400) {
          setRequiresMFA(true);
        } else if (error.response?.status === 401) {
          setFieldError("email", "Invalid credentials");
          setFieldError("password", "Invalid credentials");
          setFieldError("token", "Invalid credentials");
        } else {
          addToast("Try again", "error");
        }
      }
    },
    requiresMFA,
  ];
};

const validationSchema = yup.object({
  email: yup.string().email("Email invalid").required("Required"),
  password: yup.string().required("Required"),
});

const Login = () => {
  const [onSubmit, requiresMFA] = useLogin();
  const location = useLocation();

  return (
    <>
      <Title title="Login" />
      <Formik<IForm>
        initialValues={{
          email: (location.state as any)?.email ?? "",
          password: "",
          token: "",
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ dirty, isSubmitting, values }) => (
          <Form>
            <EmailField fullWidth label="Email" name="email" required />
            <PasswordField
              autoComplete="password"
              fullWidth
              label="Password"
              name="password"
              required
            />
            {requiresMFA ? (
              <TotpField
                fullWidth={true}
                label="One time code"
                name="token"
                required={true}
              />
            ) : null}
            <FormActions
              disabled={!dirty}
              isSubmitting={isSubmitting}
              label="Login"
              links={[
                {
                  label: "Reset password",
                  to: "/forgotten-password/",
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
      <BookIntro />
    </>
  );
};

export default Login;
