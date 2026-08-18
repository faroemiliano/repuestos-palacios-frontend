import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home/Home";
import ProductoPage from "./pages/ProductoPage";
import CatalogoPage from "./pages/CatalogoPage";
import ContactoPage from "./pages/ContactoPage";
import MarcasPage from "./pages/MarcaPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductosPage from "./pages/admin/AdminProductosPage";
import AdminCrearProductoPage from "./pages/admin/AdminCrearProductoPage";
import AdminEditarProductoPage from "./pages/admin/AdminEditarProductoPage";
import AdminMarcasPage from "./pages/admin/AdminMarcasPage";
import AdminCrearMarcaPage from "./pages/admin/AdminCrearMarcaPage";
import AdminEditarMarcaPage from "./pages/admin/AdminEditarMarcaPage";
import AdminCategoriasPage from "./pages/admin/AdminCategoriasPage";
import AdminConsultasPage from "./pages/admin/AdminConsultasPage";

import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminCrearCategoriaPage from "./pages/admin/AdminCrearCategorias";
import AdminEditarCategoriaPage from "./pages/admin/AdminEditarCategoriaPage";
import ClienteLoginPage from "./pages/ClienteLoginPage";
import MiCuentaPage from "./pages/MiCuentaPage";

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

          <Route path="/mi-cuenta" element={<MiCuentaPage />} />
        </Route>

        {/* =========================
            LOGIN ADMIN
            ========================= */}

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/ingresar" element={<ClienteLoginPage />} />

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

            <Route
              path="/admin/productos/:id/editar"
              element={<AdminEditarProductoPage />}
            />
            <Route path="/admin/marcas" element={<AdminMarcasPage />} />

            <Route path="/admin/consultas" element={<AdminConsultasPage />} />

            <Route
              path="/admin/marcas/nueva"
              element={<AdminCrearMarcaPage />}
            />
            <Route
              path="/admin/marcas/:id/editar"
              element={<AdminEditarMarcaPage />}
            />
            <Route path="/admin/categorias" element={<AdminCategoriasPage />} />
            <Route
              path="/admin/categorias/nueva"
              element={<AdminCrearCategoriaPage />}
            />
            <Route
              path="/admin/categorias/:id/editar"
              element={<AdminEditarCategoriaPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
