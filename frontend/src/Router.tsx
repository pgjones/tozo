import { BrowserRouter, Route, Routes } from "react-router-dom";

import RequireAuth from "src/components/RequireAuth";
import ScrollToTop from "src/components/ScrollToTop";
import TopBar from "src/components/TopBar";
import ChangePassword from "src/pages/ChangePassword";
import ConfirmEmail from "src/pages/ConfirmEmail";
import CreateTodo from "src/pages/CreateTodo";
import EditTodo from "src/pages/EditTodo";
import ForgottenPassword from "src/pages/ForgottenPassword";
import Login from "src/pages/Login";
import MFA from "src/pages/MFA";
import Register from "src/pages/Register";
import ResetPassword from "src/pages/ResetPassword";
import Todos from "src/pages/Todos";

const ThrowError = () => {
  throw new Error("Test Error");
};

const Router = () => (
  <BrowserRouter>
    <ScrollToTop />
    <TopBar />
    <Routes>
      <Route path="/register/" element={<Register />} />
      <Route path="/confirm-email/:token/" element={<ConfirmEmail />} />
      <Route path="/login/" element={<Login />} />
      <Route
        path="/change-password/"
        element={
          <RequireAuth>
            <ChangePassword />
          </RequireAuth>
        }
      />
      <Route path="/forgotten-password/" element={<ForgottenPassword />} />
      <Route path="/reset-password/:token/" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Todos />
          </RequireAuth>
        }
      />
      <Route
        path="/todos/new/"
        element={
          <RequireAuth>
            <CreateTodo />
          </RequireAuth>
        }
      />
      <Route
        path="/todos/:id/"
        element={
          <RequireAuth>
            <EditTodo />
          </RequireAuth>
        }
      />
      <Route
        path="/mfa/"
        element={
          <RequireAuth>
            <MFA />
          </RequireAuth>
        }
      />
      <Route element={<ThrowError />} path="/test-error/" />
    </Routes>
  </BrowserRouter>
);

export default Router;
