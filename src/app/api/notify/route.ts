import { NextResponse } from "next/server";

/** Demo store. Swap for the real list provider when the drop is live. */
const registered = new Set<string>(["kasper@lqvst.se"]);

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export async function POST(request: Request) {
  let email = "";

  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Enter an email address." }, { status: 400 });
  }

  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { error: "That address does not look right. Check the domain." },
      { status: 400 },
    );
  }

  if (registered.has(email)) {
    return NextResponse.json(
      { error: "You are already on the list for Drop 01." },
      { status: 409 },
    );
  }

  registered.add(email);

  // Stand-in for the provider round-trip so the client shows a real pending state.
  await new Promise((r) => setTimeout(r, 700));

  return NextResponse.json({ position: 1200 + registered.size * 37 });
}
