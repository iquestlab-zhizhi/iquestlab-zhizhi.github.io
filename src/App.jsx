import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SimplePage from "./pages/SimplePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/report" element={<SimplePage title="技术报告" />} />
        <Route path="/download" element={<SimplePage title="模型下载" />} />
        <Route path="/contact" element={<SimplePage title="联系我们" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
