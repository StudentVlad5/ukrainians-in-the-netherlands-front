"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { onFetchError, onSuccess } from "@/lib/Messages/NotifyMessages";
import { createRoleRequests } from "@/helper/api/viewRolesData.js";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { checkToken } from "@/helper/api/checkTocken";

const RoleRequestForm = ({ currentUserRole }: { currentUserRole: string }) => {
  const t = useTranslations("profile");
  const [requestedRole, setRequestedRole] = useState<"seller" | "admin">(
    "seller"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = checkToken(router);
      const data = await createRoleRequests(token, requestedRole);
      if (data) {
        router.push("/profile");
        return;
      }
      setIsSuccess(true);
      onSuccess(t("requestSentSuccessfully"));
    } catch (error) {
      if (error instanceof Error) {
        onFetchError(error.message);
      } else {
        onFetchError(t("failedToSendRequest"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentUserRole === "admin") return null; // Адміну не потрібно просити ролі

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
      <h2 className="text-2xl font-black text-slate-900 mb-6">
        {t("upgradeAccount")}
      </h2>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                {t("selectDesiredRole")}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRequestedRole("seller")}
                  className={`py-4 px-6 rounded-2xl font-bold transition-all ${
                    requestedRole === "seller"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {t("roleSeller")}
                </button>
                <button
                  type="button"
                  onClick={() => setRequestedRole("admin")}
                  className={`py-4 px-6 rounded-2xl font-bold transition-all ${
                    requestedRole === "admin"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {t("roleAdmin")}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 italic">
              {requestedRole === "seller"
                ? t("sellerDescription")
                : t("adminDescription")}
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-400 text-blue-900 font-black py-4 rounded-2xl hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1"
            >
              {isSubmitting ? t("sending") : t("submitRequest")}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {t("thankYou")}
            </h3>
            <p className="text-gray-600">{t("requestUnderReview")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleRequestForm;
