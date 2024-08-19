import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Auth } from "./pages/auth/Auth";
import { Admin } from "./pages/admin/Admin";
import { Profile } from "./pages/profile/Profile";
import { useAuthStore } from "./store";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

export type Props = {
  children: React.ReactNode;
};

const PrivateRouter = ({ children }: Props) => {
  const { userInfo } = useAuthStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRouter = ({ children }: Props) => {
  const { userInfo } = useAuthStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

export const App = () => {

  const {userInfo, setUserInfo} = useAuthStore();
  const [loading, setLoading] = useState(true);

  const getUserData = async() => {
    try {
      const response = await apiClient.get(GET_USER_INFO, {withCredentials: true})
      if(response.status === 200 && response.data.id){
        setUserInfo(response.data);
      } else {
        setUserInfo(undefined);
      }
    } catch (error) {
      setUserInfo(undefined);    
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(!userInfo){
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo])
  
  if(loading){
    return <div>Loading...</div>
  }

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRouter>
              <Auth />
            </AuthRouter>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRouter>
              <Admin />
            </PrivateRouter>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRouter>
              <Profile />
            </PrivateRouter>
          }
        />
        <Route path="/*" element={<Navigate to="/auth" />} />
      </Routes>
    </>
  );
};
