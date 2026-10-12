import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import VehicleCard from "@/components/VehicleCard";
import Link from "next/link";
import { getFleet } from "@/lib/server/fleet";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Fleet",
  description:
    "Explore the Methmi Enterprises fleet — vans, cars, an SUV, and a coach bus — all air-conditioned and available for Colombo airport transfers and Sri Lanka tours.",
};

export default async function FleetPage() {
  const { vehicles, total } = await getFleet();

  return (
    <section className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="Our Fleet"
        title="Comfortable vehicles for every journey"
        description="Explore our vehicles for airport transfers and multi-day tours across Sri Lanka."
      />
      {vehicles.length === 0 && (
        <p className="mt-10 rounded-xl bg-white p-6 text-ink-700">
          No vehicles are currently listed. Please contact us for availability.
        </p>
      )}
      {total > vehicles.length && (
        <p className="mt-6 text-ink-700">
          Showing {vehicles.length} of {total} vehicles. {" "}
          <Link href="/contact" className="underline">
            Contact us for more options.
          </Link>
        </p>
      )}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle, index) => (
          <VehicleCard
            key={vehicle.slug}
            vehicle={vehicle}
            isLcp={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
