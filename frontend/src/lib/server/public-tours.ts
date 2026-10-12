
import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Tour } from "@/types/tour";

type TourRow = {
  slug: string;
  name: string;
  duration: string;
  pickup_time: string;
  description: string;
  highlights: string[];
  included: string[];
  starting_price: string;
  image: string;
};

export async function getPublicTours(): Promise<Tour[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase server configuration is missing.");
  }

  // Server-side only. Never expose the service-role key
  // to browser components or the public API.
  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase
    .from("tours")
    .select(
      "slug,name,duration,pickup_time,description,highlights,included,starting_price,image"
    )
    .order("sort_order", { ascending: true })
    .limit(24);

  if (error) {
    console.error("Public tours query failed:", error.code);
    throw new Error("Unable to load tours.");
  }

  return ((data ?? []) as TourRow[]).map((row) => ({
    slug: row.slug,
    name: row.name,
    duration: row.duration,
    pickupTime: row.pickup_time,
    description: row.description,
    highlights: row.highlights,
    included: row.included,
    startingPrice: row.starting_price,
    image: row.image,
  }));
}
