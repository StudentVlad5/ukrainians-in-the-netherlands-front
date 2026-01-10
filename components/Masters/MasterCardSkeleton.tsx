export function MasterCardSkeleton() {
  return (
    <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200 relative">
        <div className="absolute top-4 right-4 h-6 w-12 bg-gray-300 rounded-full" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="h-4 w-10 bg-gray-300 rounded" />
          <div className="h-4 w-10 bg-gray-300 rounded" />
        </div>
      </div>

      <div className="p-5">
        <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-40 bg-gray-200 rounded mb-3" />

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="space-y-1">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-9 w-28 bg-gray-300 rounded-xl" />
        </div>
      </div>
    </article>
  );
}
