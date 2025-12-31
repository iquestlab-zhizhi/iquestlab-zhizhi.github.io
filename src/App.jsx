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
        <Route path="/report" element={<SimplePage titleKey="page_report" />} />
        <Route
          path="/download"
          element={<SimplePage titleKey="page_download" />}
        />
        <Route
          path="/contact"
          element={<SimplePage titleKey="page_contact" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
