import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import useGetCurrentUser from "./hooks/userGetCurrentUser.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Generate from './pages/Generate.jsx'
import Editor from "./pages/Editor.jsx";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import LiveSite from "./pages/LiveSite.jsx";
import Pricing from "./pages/Pricing.jsx";

export const serverUrl = "https://localhost:5000";

const App = () => {
  const { user, loading, error } = useGetCurrentUser();
  const {userData}= useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={userData ? <Dashboard /> : <Home/>} />
        <Route path="/generate" element={userData ? <Generate /> : <Home />} />
        <Route path="/editor/:id" element={userData ? <Editor /> : <Home />} />
        <Route path="/site/:id" element= {<LiveSite /> } />
        <Route path="/pricing" element= {<Pricing /> } />

      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;