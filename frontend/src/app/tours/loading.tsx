
import SectionHeading from "@/components/SectionHeading";

export default function ToursLoading() {
  return (
    <section className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="Sri Lanka Tours"
        title="Discover Sri Lanka with a trusted driver"
        description="Loading our available Sri Lanka tours..."
      />

      <div
        role="status"
        aria-label="Loading tours"
        className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl bg-white shadow-card"
          >
            <div className="aspect-[16/10] animate-pulse bg-gray-200" />

            <div className="space-y-4 p-5">
              <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading available tours...</span>
      </div>
    </section>
  );
}
