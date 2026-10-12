export default function Loading() {
  return (
    <div className="container-page animate-pulse py-16" aria-busy="true">
      <div className="h-6 w-40 rounded-full bg-ocean-100" />
      <div className="mt-6 h-12 w-3/4 rounded-lg bg-ocean-100" />
      <div className="mt-4 h-5 w-1/2 rounded-lg bg-ocean-100" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="h-64 rounded-xl bg-ocean-100" />
        <div className="h-64 rounded-xl bg-ocean-100" />
        <div className="h-64 rounded-xl bg-ocean-100" />
      </div>
    </div>
  );
}     