import OtpPage from "@/pages/OtpPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RequireAuth from "@/guards/RequireAuth";
import RegisterPage from "@/pages/RegisterPage";
import RequireGuest from "@/guards/RequireGuest";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "@components/layout/AuthLayout";
import WalletDetailsPage from "@/pages/WalletDetailsPage";
import DrawerLayout from "@/components/layout/DrawerLayout";

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
        <Route path="/wallets/:walletId" element={<WalletDetailsPage />} />
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
