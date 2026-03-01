import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import useGetCurrentUser from "./hooks/userGetCurrentUser.jsx";

export const serverUrl = "http://localhost:5000";

const App = () => {
  useGetCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;