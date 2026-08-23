import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WhatsAppFloat from "../components/layout/WhatsAppFloat";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <WhatsAppFloat />
    </div>
  );
}

export default MainLayout;
