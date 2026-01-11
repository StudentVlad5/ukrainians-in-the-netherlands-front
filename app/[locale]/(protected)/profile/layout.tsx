import { Sidebar } from "@/components/Profile/SideBar/SideBar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="p-4 md:p-10 mt-28 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-start">
        <Sidebar />

        <div className="flex-grow w-full transition-all duration-300">
          {children}
        </div>
      </div>
    </section>
  );
}
