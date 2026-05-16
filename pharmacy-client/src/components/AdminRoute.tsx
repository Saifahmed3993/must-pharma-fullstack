import { Navigate, useLocation } from "react-router-dom";
import { useAccount } from "../context/AccountContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAccount();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // لو المستخدم مش أدمن، ابعته للمتجر بدون loop
  if (user.role !== "Admin") {
    return <Navigate to="/shop" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
