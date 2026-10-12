import type { Tour } from "@/types/tour";
import type { Vehicle } from "@/types/vehicle";

export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

async function get<T>(path: string, tag: string): Promise<T> {
  const r = await fetch(`${BACKEND_URL}${path}`, {
    next: { revalidate: 60, tags: [tag] },
    headers: { Accept: "application/json" },
  });
  if (!r.ok) throw new Error(`Backend request failed: ${r.status}`);
  return r.json();
}

export async function getAllTours(limit?: number) {
  const query = limit ? `?limit=${limit}` : "";
  return (await get<{ tours: Tour[] }>(`/api/tours${query}`, "tours")).tours;
}

export async function getAllVehicles(limit?: number) {
  const query = limit ? `?limit=${limit}` : "";
  return (await get<{ vehicles: Vehicle[] }>(`/api/vehicles${query}`, "vehicles")).vehicles;
}