import { Navigate, useLocation } from "react-router-dom";
import { useAccount } from "../context/AccountContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAccount();
  const location = useLocation();

  if (!user) {
    // توجيه المستخدم لصفحة الـ login مع حفظ المكان اللي كان عايز يروحه
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
