import { useEffect, useState } from "react";
import { Package, CheckCircle, Clock } from "lucide-react";
import { useAccount } from "../context/AccountContext";
import agent from "../api/agent";
import { useToast } from "@/hooks/use-toast";

type OrderSummary = {
  id: number;
  buyerEmail: string;
  orderDate: string;
  total: number;
  status: string;
};

const orderStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const { user } = useAccount();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const { toast } = useToast();

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await agent.Orders.updateStatus(orderId, newStatus);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast({
        title: "Success",
        description: `Order #${orderId} status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error updating order status",
      });
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = user?.role === "Admin"
          ? await agent.Orders.listAll()
          : await agent.Orders.list();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-indigo-400 mb-8 flex items-center gap-3">
        <Package />
        {user?.role === "Admin" ? "Pharmacy Orders Dashboard (Admin)" : "My Order History"}
      </h1>

      {orders.length === 0 ? (
        <p className="text-slate-500 text-lg">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#0f172a] p-6 rounded-2xl shadow-sm border border-indigo-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-full md:w-auto">
                <p className="text-xs md:text-sm text-slate-400 mb-1">
                  Order #{order.id} • {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p className="font-bold text-lg md:text-xl text-white">Total: {order.total} EGP</p>
                {user?.role === "Admin" && (
                  <p className="text-xs md:text-sm text-indigo-400 font-medium mt-1 break-all">
                    Customer: {order.buyerEmail}
                  </p>
                )}
              </div>

              <div className="w-full md:w-auto flex items-center gap-2">
                {user?.role === "Admin" ? (
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className={`w-full md:w-auto px-6 py-3 rounded-xl font-black uppercase tracking-widest cursor-pointer outline-none transition-all shadow-lg text-xs md:text-sm appearance-none text-center border-2
                      ${order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/50 hover:bg-emerald-500/20" :
                        order.status === "Cancelled" ? "bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20" :
                        order.status === "Shipped" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/50 hover:bg-indigo-500/20" :
                        "bg-amber-500/10 text-amber-500 border-amber-500/50 hover:bg-amber-500/20"}
                      hover:scale-105 active:scale-95`}
                  >
                    {(orderStatuses.includes(order.status) ? orderStatuses : [...orderStatuses, order.status]).map((status) => (
                      <option key={status} value={status} className="bg-[#020617] text-white py-2">
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${order.status === "Pending"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                  >
                    {order.status === "Pending" ? <Clock size={16} /> : <CheckCircle size={16} />}
                    {order.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
