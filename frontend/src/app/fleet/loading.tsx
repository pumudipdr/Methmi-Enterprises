export default function FleetLoading() {
  return (
    <section className="container-page py-14 sm:py-20" role="status" aria-label="Loading vehicles">
      <span className="sr-only">Loading vehicles...</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="h-10 w-3/4 rounded bg-sand-200" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="overflow-hidden rounded-xl2 bg-white">
              <div className="aspect-[16/10] bg-sand-200" />
              <div className="space-y-4 p-5">
                <div className="h-6 w-3/4 rounded bg-sand-200" />
                <div className="h-40 rounded bg-sand-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
