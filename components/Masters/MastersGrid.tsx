"use client";

import { motion } from "framer-motion";
import MasterCard from "./MasterCard";
import { ISpecialist } from "@/helper/types/specialist";

interface MastersGridProps {
  filteredMasters: ISpecialist[];
}

export default function MastersGrid({ filteredMasters }: MastersGridProps) {
  if (filteredMasters.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Майстрів не знайдено за вашим запитом.
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {filteredMasters.map((master) => (
        <motion.div
          key={master._id?.toString()}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <MasterCard master={master} />
        </motion.div>
      ))}
    </motion.div>
  );
}
