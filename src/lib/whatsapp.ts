import type { CartItem } from "@/lib/types";

export type CheckoutDetails = {
  name: string;
  phone: string;
  address: string;
  notes: string;
};

export function buildOrderMessage(
  items: CartItem[],
  details: CheckoutDetails
) {
  const lines: string[] = [];
  lines.push("New order from the website:");
  lines.push("");

  for (const item of items) {
    const size = item.size ? `, size ${item.size}` : "";
    lines.push(
      `• ${item.name}${size} x${item.quantity} — ₹${(
        item.price * item.quantity
      ).toLocaleString("en-IN")}`
    );
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  lines.push("");
  lines.push(`Total: ₹${total.toLocaleString("en-IN")}`);
  lines.push("");
  lines.push(`Name: ${details.name}`);
  lines.push(`Phone: ${details.phone}`);
  lines.push(`Address: ${details.address}`);
  if (details.notes.trim()) {
    lines.push(`Notes: ${details.notes}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}
