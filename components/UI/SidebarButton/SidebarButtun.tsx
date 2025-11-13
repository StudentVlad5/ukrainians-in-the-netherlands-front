import { ReactNode } from "react";

export const SidebarButton = ({
  label,
  icon,
  isActive,
  onClick,
  isLogout = false,
}: {
  label: string;
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
  isLogout?: boolean;
}) => {
  const baseClasses =
    "flex items-center space-x-3 w-full p-3 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer";
  const activeClasses = "bg-blue-100 text-blue-700";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
  const logoutClasses = "text-red-600 hover:bg-red-50 hover:text-red-700";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${
        isLogout ? logoutClasses : isActive ? activeClasses : inactiveClasses
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
