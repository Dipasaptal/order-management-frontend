import { useEffect, useState } from "react";
import { getMenu, placeOrder } from "./api";
import MenuList from "./components/MenuList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderStatus from "./components/OrderStatus";
import OrdersList from "./components/OrdersList";

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("menu");
  const [orderId, setOrderId] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    getMenu().then((res) => setMenu(res.data)).catch(() => setErrors(["Backend not reachable."]));
  }, []);

  const addToCart = (item) =>
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      return existing
        ? prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
        : [...prev, { ...item, quantity: 1 }];
    });

  const changeQty = (id, qty) =>
    qty < 1 ? removeItem(id) : setCart((prev) => prev.map((c) => (c.id === id ? { ...c, quantity: qty } : c)));

  const removeItem = (id) => setCart((prev) => prev.filter((c) => c.id !== id));
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handlePlaceOrder = async (customer) => {
    setPlacing(true);
    setErrors([]);
    try {
      const res = await placeOrder({ items: cart.map((c) => ({ id: c.id, quantity: c.quantity })), customer });
      setOrderId(res.data._id);
      setCart([]);
      setView("status");
    } catch (e) {
      setErrors(e.response?.data?.errors || ["Something went wrong."]);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="flex justify-between items-center px-4 sm:px-8 py-4 border-b border-neutral-800 sticky top-0 bg-neutral-950/80 backdrop-blur-md z-30">
        <button onClick={() => setView("menu")} className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-sm">🍔</span>
          <span className="font-bold text-lg tracking-tight">Order Up</span>
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("orders")}
            className="text-sm text-neutral-400 hover:text-orange-300 transition-colors"
          >
            All Orders
          </button>
          {cartCount > 0 && (
            <button
              onClick={() => setView("checkout")}
              className="relative w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center hover:border-orange-400 transition"
            >
              🛒
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          )}
        </div>
      </header>

      {view === "menu" && (
        <div className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
          <div className="absolute -top-10 left-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulseGlow" />
          <div className="absolute top-10 right-1/4 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulseGlow" style={{ animationDelay: "1.5s" }} />
          <div className="relative px-4 sm:px-8 pt-14 pb-10 text-center animate-fadeUp">
            <span className="inline-block text-orange-400 text-xs uppercase tracking-widest font-mono bg-orange-500/10 border border-orange-500/30 rounded-full px-3 py-1 mb-4">
              🔥 Fresh off the grill, delivered fast
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Order Up
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto">
              Pick from our menu, build your cart, and track every order live — from kitchen to your doorstep.
            </p>
            <div className="flex justify-center gap-8 mt-8 text-3xl">
              <span className="animate-float">🍕</span>
              <span className="animate-float" style={{ animationDelay: "0.6s" }}>🍔</span>
              <span className="animate-float" style={{ animationDelay: "1.2s" }}>🍟</span>
              <span className="animate-float" style={{ animationDelay: "1.8s" }}>🥤</span>
            </div>
          </div>
        </div>
      )}

      <main className="px-4 sm:px-8 py-8 max-w-7xl mx-auto">
        {view === "menu" && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            <MenuList menu={menu} onAdd={addToCart} cart={cart} />
            <div className="lg:sticky lg:top-24">
              <Cart cart={cart} onQtyChange={changeQty} onRemove={removeItem} onCheckout={() => setView("checkout")} />
            </div>
          </div>
        )}
        {view === "checkout" && (
          <div className="animate-fadeUp">
            <Checkout cart={cart} onBack={() => setView("menu")} onPlaceOrder={handlePlaceOrder} placing={placing} errors={errors} />
          </div>
        )}
        {view === "status" && orderId && (
          <div className="animate-fadeUp">
            <OrderStatus orderId={orderId} onNewOrder={() => { setOrderId(null); setView("menu"); }} />
          </div>
        )}
        {view === "orders" && (
          <OrdersList onBack={() => setView("menu")} onOpenOrder={(id) => { setOrderId(id); setView("status"); }} />
        )}
      </main>

      {view === "menu" && cartCount > 0 && (
        <button
          onClick={() => setView("checkout")}
          className="lg:hidden fixed bottom-4 left-4 right-4 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold shadow-lg shadow-red-500/30 flex justify-between items-center px-5 z-20"
        >
          <span>{cartCount} item{cartCount > 1 ? "s" : ""} in cart</span>
          <span>Checkout →</span>
        </button>
      )}
    </div>
  );
}

export default App;