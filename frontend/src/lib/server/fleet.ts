import "server-only";

import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Vehicle } from "@/types/vehicle";

export const FLEET_LIMIT = 12;

type VehicleRow = {
  slug: string;
  name: string;
  category: Vehicle["category"];
  seats: number;
  ac: boolean;
  luggage_capacity: string;
  description: string;
  image: string;
  sample_prices: Partial<Vehicle["samplePrices"]> | null;
};

// Only public vehicle fields enter this shared cache. Never add session data.
async function readFleet() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");

  const database = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });

  const { data, count, error } = await database
    .from("vehicles")
    .select(
      "slug,name,category,seats,ac,luggage_capacity,description,image,sample_prices",
      { count: "exact" },
    )
    .order("sort_order", { ascending: true })
    .order("slug", { ascending: true })
    .limit(FLEET_LIMIT)
    .abortSignal(AbortSignal.timeout(10000))
    .returns<VehicleRow[]>();

  if (error) {
    console.error("Fleet query failed:", error.code);
    throw new Error("Unable to load vehicles.");
  }

  const vehicles: Vehicle[] = (data ?? []).map((row) => ({
    slug: row.slug,
    name: row.name,
    category: row.category,
    seats: row.seats,
    ac: row.ac,
    luggageCapacity: row.luggage_capacity,
    description: row.description,
    image: row.image,
    samplePrices: {
      colombo: row.sample_prices?.colombo ?? "",
      galle: row.sample_prices?.galle ?? "",
      sigiriya: row.sample_prices?.sigiriya ?? "",
    },
  }));

  return { vehicles, total: count ?? vehicles.length };
}

export const getFleet = unstable_cache(readFleet, ["public-fleet-v1"], {
  revalidate: 60,
  tags: ["public-fleet"],
});
