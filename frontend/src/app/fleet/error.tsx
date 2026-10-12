"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";

export default function FleetError({ reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <section className="container-page py-20">
      <h1 className="text-3xl font-bold">We couldn't load our fleet</h1>
      <p className="mt-3 text-ink-700">Please try again in a moment.</p>
      <button
        type="button"
        onClick={() => startTransition(() => { router.refresh(); reset(); })}
        className="mt-6 rounded-full bg-ocean-600 px-6 py-3 font-semibold text-white hover:bg-ocean-700"
      >
        Try again
      </button>
    </section>
  );
}
