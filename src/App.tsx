import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home/Home";
import ProductoPage from "./pages/ProductoPage";
import CatalogoPage from "./pages/CatalogoPage";
import ContactoPage from "./pages/ContactoPage";
import MarcasPage from "./pages/MarcaPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProductosPage from "./pages/admin/AdminProductosPage";
import AdminCrearProductoPage from "./pages/admin/AdminCrearProductoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            SITIO PÚBLICO
            ========================= */}

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/marcas" element={<MarcasPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/producto/:slug" element={<ProductoPage />} />
        </Route>

        {/* =========================
            LOGIN ADMIN
            ========================= */}

        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* =========================
            PANEL ADMIN
            ========================= */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/productos" element={<AdminProductosPage />} />
            <Route
              path="/admin/productos/nuevo"
              element={<AdminCrearProductoPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
