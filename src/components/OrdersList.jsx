import { useEffect, useState } from "react";
import { getAllOrders } from "../api";

const STATUS_COLOR = {
  "Order Received": "bg-neutral-500",
  "Preparing": "bg-orange-400",
  "Out for Delivery": "bg-blue-400",
  "Delivered": "bg-green-500"
};

export default function OrdersList({ onBack, onOpenOrder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then((res) => setOrders(res.data.reverse()))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto animate-fadeUp">
      <button onClick={onBack} className="text-neutral-400 text-sm mb-4">← Back to menu</button>
      <h2 className="text-white text-xl font-bold mb-4">All Orders</h2>

      {loading ? (
        <p className="text-neutral-400 text-sm">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-neutral-400 text-sm">No orders placed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {orders.map((order, i) => (
            <button
              key={order._id}
              onClick={() => onOpenOrder(order._id)}
              style={{ animationDelay: `${i * 60}ms` }}
              className="text-left bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:border-orange-400 hover:-translate-y-0.5 transition-all duration-200 animate-fadeUp opacity-0"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm text-white">#{order._id.slice(-4).toUpperCase()}</span>
                <span className={`text-xs text-white px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-neutral-400 text-xs mb-1">{order.customer.name} — {order.customer.address}</p>
              <p className="text-orange-300 text-sm font-mono">₹{order.totalAmount}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}