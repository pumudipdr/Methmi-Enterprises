
"use client";

import { useEffect } from "react";

export default function ToursError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public tours page error:", error);
  }, [error]);

  return (
    <section className="container-page py-20 text-center">
      <h1 className="text-2xl font-bold text-ink-900">
        Unable to load tours
      </h1>

      <p className="mt-4 text-ink-700">
        We couldn't load the available tours right now.
        Please try again.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-ocean-700 px-6 py-3 font-semibold text-white hover:bg-ocean-800"
      >
        Try Again
      </button>
    </section>
  );
}
