export function getOriginalPrice(product, variant = null) {
  return Number(variant?.price ?? product.base_price);
}

export function getFinalPrice(product, variant = null) {
  const original = getOriginalPrice(product, variant);
  const percentage = Number(product.sale_percentage ?? 0);

  return Math.round(
    original * (100 - percentage) + Number.EPSILON
  ) / 100;
}