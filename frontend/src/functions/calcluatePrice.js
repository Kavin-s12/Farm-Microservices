export const priceCalculator = (orderItems) => {
  const TAX_PERCENTAGE = 8;
  const FREE_SHIPPING_THRESHOLD = 500;
  const SHIPPING_CHARGE = 99;

  let itemsPrice = 0;

  for (const item of orderItems) {
    itemsPrice += item.price * item.qty;
  }

  const taxPrice = parseFloat((itemsPrice * (TAX_PERCENTAGE / 100)).toFixed(2));
  const shippingCharges =
    itemsPrice < FREE_SHIPPING_THRESHOLD
      ? parseFloat(SHIPPING_CHARGE.toFixed(2))
      : 0;
  const totalPrice = parseFloat(
    (itemsPrice + taxPrice + shippingCharges).toFixed(2)
  );

  return { itemsPrice, taxPrice, shippingCharges, totalPrice };
};
