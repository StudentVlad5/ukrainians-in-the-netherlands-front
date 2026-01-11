export default function Loading() {
  return (
    <div className="w-full space-y-6 animate-pulse p-6 bg-white rounded-[32px]">
      {/* Скелетон заголовка */}
      <div className="h-8 bg-gray-200 rounded-full w-1/3 mb-8" />

      {/* Скелетон полів форми */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-20" />
            <div className="h-12 bg-gray-50 rounded-2xl w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-20" />
            <div className="h-12 bg-gray-50 rounded-2xl w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-20" />
          <div className="h-32 bg-gray-50 rounded-2xl w-full" />
        </div>
      </div>

      {/* Скелетон кнопки */}
      <div className="h-14 bg-gray-200 rounded-2xl w-full mt-8" />
    </div>
  );
}
