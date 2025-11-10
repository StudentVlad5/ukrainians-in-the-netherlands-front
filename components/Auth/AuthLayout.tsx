import React from "react";
import Link from "next/link";

type AuthLayoutProps = {
  title: string;
  children: React.ReactNode;
  footerLink: "login" | "register";
};

export default function AuthLayout({
  title,
  children,
  footerLink,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {children}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {footerLink === "login"
                    ? "Вже маєте акаунт?"
                    : "Ще немає акаунту?"}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href={footerLink === "login" ? "/login" : "/register"}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {footerLink === "login" ? "Увійти" : "Зареєструватися"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
