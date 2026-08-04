export default function Cart({ cart, onQtyChange, onRemove, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <aside className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 w-full">
      <h2 className="text-white font-bold mb-3">Cart</h2>

      {cart.length === 0 ? (
        <p className="text-neutral-400 text-sm">Cart is empty.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-3 mb-4">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b border-dashed border-neutral-700 pb-2">
                <div>
                  <p className="text-white text-sm">{item.name}</p>
                  <p className="text-neutral-500 text-xs">₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => onQtyChange(item.id, item.quantity - 1)} className="w-6 h-6 bg-neutral-800 text-white rounded">−</button>
                  <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => onQtyChange(item.id, item.quantity + 1)} className="w-6 h-6 bg-neutral-800 text-white rounded">+</button>
                  <button onClick={() => onRemove(item.id)} className="text-red-400 text-xs ml-1">✕</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-white font-mono mb-3">
            <span>Total</span>
            <span className="text-orange-300">₹{total}</span>
          </div>
          <button onClick={onCheckout} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold text-sm">
            Proceed to checkout
          </button>
        </>
      )}
    </aside>
  );
}