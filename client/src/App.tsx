import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Auth } from "./pages/auth/Auth";
import { Admin } from "./pages/admin/Admin";
import { Profile } from "./pages/profile/Profile";
export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<Navigate to="/auth"/>} />
      </Routes>
    </>
  );
};
