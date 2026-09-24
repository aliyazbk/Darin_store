import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

function CartItem({
  item,
  onQuantityChange,
  onRemove,
}) {
  const lineTotal = item.price * item.quantity;

  return (
    <article className="cart-item">
      <div className="cart-item__information">
        <Link to={`/products/${item.slug}`}>
          <h2>{item.name}</h2>
        </Link>

        <p>
          Size: {item.size} | Color: {item.color}
        </p>

        <p>{formatCurrency(item.price)} each</p>
      </div>

      <div className="cart-item__quantity">
        <label htmlFor={`quantity-${item.variantId}`}>
          Quantity
        </label>

        <input
          id={`quantity-${item.variantId}`}
          type="number"
          min="1"
          max={item.stockQuantity}
          value={item.quantity}
          onChange={(event) =>
            onQuantityChange(
              item.variantId,
              Number(event.target.value)
            )
          }
        />
      </div>

      <p className="cart-item__total">
        {formatCurrency(lineTotal)}
      </p>

      <button
        type="button"
        onClick={() => onRemove(item.variantId)}
      >
        Remove
      </button>
    </article>
  );
}

export default CartItem; 