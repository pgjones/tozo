import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "src/components/ScrollToTop";
import TopBar from "src/components/TopBar";
import Register from "src/pages/Register";

const Router = () => (
  <BrowserRouter>
    <ScrollToTop />
    <TopBar />
    <Routes>
      <Route path="/register/" element={<Register />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
