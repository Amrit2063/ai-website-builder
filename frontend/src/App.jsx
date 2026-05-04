import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import useGetCurrentUser from "./hooks/userGetCurrentUser.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Generate from "./pages/Generate.jsx";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import LiveSite from "./pages/LiveSite.jsx";
import Pricing from "./pages/Pricing.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import PaymentSuccessModal from "./components/PaymentSuccessModal.jsx";
import PaymentCancelModal from "./components/PaymentCancelModal.jsx";

export const serverUrl = "https://localhost:5000";

const App = () => {
  useGetCurrentUser();

  const { userData } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a103d] to-[#09090f] text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/dashboard"
            element={userData ? <Dashboard /> : <Home />}
          />

          <Route
            path="/generate"
            element={userData ? <Generate /> : <Home />}
          />

          <Route
            path="/editor/:id"
            element={userData ? <EditorPage /> : <Home />}
          />

          <Route path="/site/:id" element={<LiveSite />} />

          <Route path="/pricing" element={<Pricing />} />

          <Route path="/billing-success" element={<PaymentSuccessModal />} />

          <Route path="/billing-failed" element={<PaymentCancelModal />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
          toastClassName="bg-zinc-900 text-white border border-white/10"
        />
      </BrowserRouter>
    </div>
  );
};

export default App;
