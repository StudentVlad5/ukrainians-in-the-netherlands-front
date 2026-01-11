export const TestimonialsSceleton: React.FC = () => {
  const skeletonCards = Array(3).fill(0);

  return skeletonCards.map((_, index) => (
    <div
      key={`skeleton-${index}`}
      className="bg-white p-8 rounded-lg shadow-lg animate-pulse"
    >
      <div className="bg-gray-200 w-10 h-10 rounded-full mb-4" />
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="flex items-center">
        <div className="ml-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  ));
};
