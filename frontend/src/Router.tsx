import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "src/components/ScrollToTop";
import TopBar from "src/components/TopBar";
import ConfirmEmail from "src/pages/ConfirmEmail";
import Register from "src/pages/Register";

const Router = () => (
  <BrowserRouter>
    <ScrollToTop />
    <TopBar />
    <Routes>
      <Route path="/register/" element={<Register />} />
      <Route path="/confirm-email/:token/" element={<ConfirmEmail />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
