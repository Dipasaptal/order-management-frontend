const CATEGORY_ICON = {
  Pizza: "🍕",
  Burgers: "🍔",
  Sides: "🍟",
  Beverages: "🥤"
};

export default function MenuList({ menu, onAdd, cart }) {
  const categories = [...new Set(menu.map((m) => m.category))];

  return (
    <div className="w-full">
      {categories.map((cat) => (
        <section key={cat} className="mb-10">
          <h2 className="flex items-center gap-2 text-white text-lg font-serif font-semibold mb-4">
            <span>{CATEGORY_ICON[cat] || "🍽️"}</span>
            {cat}
            <span className="flex-1 h-px bg-neutral-800 ml-2" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {menu
              .filter((item) => item.category === cat)
              .map((item, i) => {
                const inCart = cart.find((c) => c.id === item._id);
                return (
                  <div
                    key={item._id}
                    style={{ animationDelay: `${i * 70}ms` }}
                    className="group bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-orange-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 animate-fadeUp opacity-0"
                  >
                    <div className="relative overflow-hidden h-40">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute top-2 right-2 bg-neutral-950/80 backdrop-blur text-orange-300 text-xs font-mono px-2 py-1 rounded-full">
                        ₹{item.price}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                      <p className="text-neutral-400 text-xs leading-relaxed">{item.description}</p>
                      <button
                        onClick={() => onAdd({ ...item, id: item._id })}
                        className={`mt-1 text-xs py-2 rounded-lg font-medium transition-all active:scale-95 ${
                          inCart
                            ? "bg-orange-500/20 text-orange-300 border border-orange-500"
                            : "border border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        }`}
                      >
                        {inCart ? `✓ Added (${inCart.quantity}) — add more` : "+ Add to cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}