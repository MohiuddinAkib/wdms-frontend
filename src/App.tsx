import OtpPage from "@/pages/OtpPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RequireAuth from "@/guards/RequireAuth";
import RegisterPage from "@/pages/RegisterPage";
import RequireGuest from "@/guards/RequireGuest";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "@components/layout/AuthLayout";
import DrawerLayout from "@/components/layout/DrawerLayout";

// wallet create kra
// denomination add kra
// money add kra
// withdraw kra
// transaction list dekha

function App() {
  return (
    <Routes>
      <Route
        element={
          <RequireAuth>
            <DrawerLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route
        path="auth"
        element={
          <RequireGuest>
            <AuthLayout />
          </RequireGuest>
        }
      >
        <Route path="otp" element={<OtpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;
