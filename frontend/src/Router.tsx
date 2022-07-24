import { BrowserRouter, Routes } from "react-router-dom";

import ScrollToTop from "src/components/ScrollToTop";
import TopBar from "src/components/TopBar";

const Router = () => (
  <BrowserRouter>
    <ScrollToTop />
    <TopBar />
    <Routes>{/* Place routes here */}</Routes>
  </BrowserRouter>
);

export default Router;
