import { NextResponse, type NextRequest } from "next/server";
import { CATALOG } from "@/lib/catalog";
import { liveCatalog } from "@/lib/live-catalog";
import { createCart } from "@/lib/shopify";

export const dynamic = "force-dynamic";

type Line = { id: string; qty: number };

/**
 * Checks a discount code the way it will actually be charged.
 *
 * The bag could pretend to know what a code is worth, but the only place a
 * code is real is Shopify, and a bag that shows a saving Shopify then refuses
 * is the exact overcharge this shop has already shipped once. So the check
 * builds the same cart the checkout will build, with the code on it, and
 * reads back what Shopify says it will charge. The saving the shopper sees
 * is Shopify's figure, and the code goes to checkout on the same cart shape.
 */
export const CODE_SHAPE = /^[A-Z0-9][A-Z0-9_-]{1,39}$/;

export async function POST(request: NextRequest) {
  let body: { lines?: unknown; code?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  if (!CODE_SHAPE.test(code)) {
    return NextResponse.json({ applicable: false, reason: "That is not a valid code." });
  }

  const lines = Array.isArray(body.lines) ? (body.lines as Line[]) : [];
  const wanted = new Map<string, number>();
  for (const l of lines) {
    const qty = Math.floor(Number(l?.qty));
    if (!CATALOG[l?.id] || !Number.isFinite(qty) || qty < 1 || qty > 99) continue;
    wanted.set(l.id, (wanted.get(l.id) ?? 0) + qty);
  }
  if (!wanted.size) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });

  const live = await liveCatalog();
  if (!live) {
    return NextResponse.json(
      { error: "Codes cannot be checked right now. It will still apply at checkout." },
      { status: 503 },
    );
  }

  const cartLines = [];
  for (const [id, quantity] of wanted) {
    const item = live[id];
    if (!item) return NextResponse.json({ error: "Your bag is out of date." }, { status: 400 });
    cartLines.push({ variantId: item.variantId, quantity });
  }

  try {
    const cart = await createCart(cartLines, { purpose: "code-check" }, null, [code]);
    const hit = cart.discountCodes.find((c) => c.code.toUpperCase() === code);
    const discount = cart.discountAllocations.reduce(
      (n, d) => n + Math.round(Number(d.discountedAmount.amount) * 100),
      0,
    );
    return NextResponse.json({
      applicable: Boolean(hit?.applicable),
      code,
      // everything Shopify took off this bag, the code and any automatic
      // discount together — one figure the checkout will agree with
      discount,
      subtotal: Math.round(Number(cart.cost.subtotalAmount.amount) * 100),
      total: Math.round(Number(cart.cost.totalAmount.amount) * 100),
      reason: hit?.applicable ? undefined : "That code does not apply to this bag.",
    });
  } catch (err) {
    console.error("[discount] check failed:", err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: "Codes cannot be checked right now. It will still apply at checkout." },
      { status: 502 },
    );
  }
}
