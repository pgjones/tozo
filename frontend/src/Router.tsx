import { BrowserRouter, Routes } from "react-router-dom";

import ScrollToTop from "src/components/ScrollToTop";

const Router = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>{/* Place routes here */}</Routes>
  </BrowserRouter>
);

export default Router;
