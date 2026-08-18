import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Chatbot from "../components/chatbot/Chatbot";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <Chatbot />
    </div>
  );
}

export default MainLayout;
