import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, SnowflakeIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { FrostField } from "@/components/frost-field";
import { ClearCart } from "@/components/clear-cart";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { money } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FrostField />
      <main className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col justify-center px-4 py-24 sm:px-6">
        <div className="glass-edge rounded-[2rem] bg-paper/80 p-8 backdrop-blur-md sm:p-12">
          {children}
        </div>
      </main>
    </>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: id } = await searchParams;

  if (!id || !stripeConfigured()) {
    return (
      <Shell>
        <WarningCircleIcon size={26} weight="thin" className="text-fog" />
        <h1 className="mt-6 text-3xl leading-none tracking-tighter text-white-ice">
          No order to show.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-fog">
          This page needs a Stripe session to look up. If you have just paid,
          check your email — the confirmation is the receipt that matters.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-ice-700"
        >
          <ArrowLeftIcon size={14} weight="bold" />
          Back to the shop
        </Link>
      </Shell>
    );
  }

  let session;
  try {
    session = await stripe().checkout.sessions.retrieve(id, {
      expand: ["line_items"],
    });
  } catch {
    return (
      <Shell>
        <WarningCircleIcon size={26} weight="thin" className="text-fog" />
        <h1 className="mt-6 text-3xl leading-none tracking-tighter text-white-ice">
          We could not find that order.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-fog">
          The link may have expired. Your email confirmation from Stripe is the
          authoritative receipt.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-ice-700"
        >
          <ArrowLeftIcon size={14} weight="bold" />
          Back to the shop
        </Link>
      </Shell>
    );
  }

  const paid = session.payment_status === "paid";
  const email = session.customer_details?.email ?? "your inbox";
  const items = session.line_items?.data ?? [];
  const reference = `IT-${session.id.slice(-8).toUpperCase()}`;

  return (
    <Shell>
      {paid && <ClearCart />}

      <SnowflakeIcon size={28} weight="thin" className="text-ice-500" />
      <p className="mt-6 font-mono text-[11px] tracking-[0.28em] text-fog uppercase">
        Order {reference}
      </p>
      <h1 className="mt-3 text-4xl leading-[0.95] font-medium tracking-tighter text-white-ice">
        {paid ? "That is yours." : "Payment still settling."}
      </h1>
      <p className="mt-5 max-w-[48ch] text-sm leading-relaxed text-fog">
        {paid ? (
          <>
            A confirmation is on its way to{" "}
            <span className="text-frost">{email}</span>. Drop 01 ships 1
            September, and you will get a tracking number the morning it leaves
            Stockholm.
          </>
        ) : (
          <>
            Your bank has not confirmed the payment yet. This can take a few
            minutes — we will email{" "}
            <span className="text-frost">{email}</span> the moment it clears.
          </>
        )}
      </p>

      {items.length > 0 && (
        <ul className="mt-8 divide-y divide-frost/8 border-y border-frost/8">
          {items.map((l) => (
            <li key={l.id} className="flex justify-between py-4 text-sm">
              <span className="text-frost">
                {l.description}
                <span className="ml-2 font-mono text-xs text-fog">×{l.quantity}</span>
              </span>
              <span className="font-mono text-white-ice">{money(l.amount_total)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex justify-between text-sm">
        <span className="font-medium text-white-ice">{paid ? "Paid" : "Total"}</span>
        <span className="font-mono text-lg text-white-ice">
          {money(session.amount_total ?? 0)}
        </span>
      </div>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ice-700"
      >
        <ArrowLeftIcon size={14} weight="bold" />
        Back to the shop
      </Link>
    </Shell>
  );
}
