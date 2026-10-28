export function formatPrice(from, to) {
  if (from == null) return "Price on request";

  const format = (value) =>
    "KES " +
    new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(value);

  return to ? `${format(from)} – ${format(to)}` : format(from);
}

export const availabilityLabels = {
  "in-stock": "In stock",
  limited: "Limited stock",
  "made-to-order": "Made to order",
};
export function toTelLink(phone) {
  // 0700000001 -> tel:+254700000001
  return "tel:+254" + phone.replace(/\s/g, "").replace(/^0/, "");
}

export function whatsappLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export const checkLabels = {
  phoneConfirmed: "Phone number confirmed",
  premisesVisited: "Premises visited",
  customerReviews: "Customer reviews received",
};

export function isVerified(supplier) {
  return supplier.verified;
}
