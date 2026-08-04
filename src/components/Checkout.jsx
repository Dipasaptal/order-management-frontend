import { useState } from "react";

export default function Checkout({ cart, onBack, onPlaceOrder, placing, errors }) {
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder(form);
  };

  return (
    <div className="max-w-md mx-auto">
      <button onClick={onBack} className="text-neutral-400 text-sm mb-4">← Back to menu</button>
      <h2 className="text-white text-xl font-bold mb-4">Delivery details</h2>

      {errors?.length > 0 && (
        <ul className="bg-red-500/10 border border-red-500 text-red-300 text-sm p-3 rounded mb-4">
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm" />
        <textarea name="address" placeholder="Delivery address" value={form.address} onChange={handleChange} required rows={3}
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm" />
        <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm" />

        <div className="flex justify-between text-white font-mono border-t border-dashed border-neutral-700 pt-3">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button type="submit" disabled={placing}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white py-2 rounded font-semibold text-sm">
          {placing ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}