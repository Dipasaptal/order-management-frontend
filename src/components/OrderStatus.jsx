import { useEffect, useState } from "react";
import { getOrder } from "../api";

const STEPS = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];

export default function OrderStatus({ orderId, onNewOrder }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let active = true;
    const poll = () => getOrder(orderId).then((res) => active && setOrder(res.data)).catch(() => {});
    poll();
    const id = setInterval(poll, 3000);
    return () => { active = false; clearInterval(id); };
  }, [orderId]);

  if (!order) return <p className="text-center text-neutral-400">Fetching your order…</p>;

  const currentStep = STEPS.indexOf(order.status);

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-neutral-100 text-neutral-900 rounded-xl p-6">
        <div className="flex justify-between mb-4">
          <span className="text-red-500 text-xs uppercase tracking-widest">Order ticket</span>
          <span className="font-mono font-semibold">#{order._id.slice(-4).toUpperCase()}</span>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          {STEPS.map((step, i) => (
            <div key={step} className={`flex items-center gap-2 ${i <= currentStep ? "opacity-100" : "opacity-30"}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${i === currentStep ? "bg-orange-400" : i < currentStep ? "bg-red-500" : "bg-neutral-400"}`} />
              <span className="text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-neutral-400 pt-3 flex flex-col gap-1 font-mono text-sm">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between">
              <span>{it.quantity} × {it.name}</span>
              <span>₹{it.price * it.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-neutral-400 mt-3 pt-3 flex justify-between font-mono font-bold">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      <button onClick={onNewOrder} className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold text-sm">
        Place another order
      </button>
    </div>
  );
}