import CartItem from "./CartItem";

function CartList({
  items,
  onQuantityChange,
  onRemove,
}) {
  return (
    <div className="cart-list">
      {items.map((item) => (
        <CartItem
          key={item.variantId}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default CartList;