export function EventCardSkeleton() {
  return (
    <article className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
      <div className="h-64 bg-gray-200 relative">
        <div className="absolute top-4 left-4 h-6 w-28 bg-gray-300 rounded-full" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-6 w-full bg-gray-200 rounded mb-2" />
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />

        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>

        <div className="h-4 w-32 bg-gray-200 rounded mt-auto" />
      </div>
    </article>
  );
}
