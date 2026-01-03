import Image from "next/image";

interface MarketplaceCardProps {
  id: string;
  type: "product" | "service";
  title: string;
  subtitle: string;
  imageUrl: string;
  price: number;
  location: string;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  id,
  type,
  title,
  subtitle,
  imageUrl,
  price,
  location,
}) => {
  const link = type === "product" ? `/products/${id}` : `/masters/${id}`;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
      <div className="relative h-40 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
      </div>

      <div className="p-4 space-y-1">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {title}
        </h3>

        <p className="text-xs text-gray-500 truncate">{subtitle}</p>

        <p className="text-xs text-gray-400 flex items-center gap-1">
          📍 {location}
        </p>

        <div className="flex justify-between items-center pt-2">
          <span className="font-bold text-blue-600">€{price}</span>

          <a
            href={link}
            className="text-xs font-medium text-blue-500 hover:underline"
          >
            Детальніше →
          </a>
        </div>
      </div>
    </div>
  );
};
