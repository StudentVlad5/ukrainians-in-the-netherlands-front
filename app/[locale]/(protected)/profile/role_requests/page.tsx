"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/UI/Card/card";
import { Button } from "@/components/UI/Button/Button";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { IRoleRequest } from "@/helper/types/roleRequest";
import {
  DeleteRoleRequest,
  editRoleRequests,
  getAllRoleRequests,
} from "@/helper/api/viewRolesData";

export default function RoleRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isReNew, setIsReNew] = useState(false);
  const t = useTranslations("admin");
  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (!token) return;
    const fetchRequests = async () => {
      try {
        const data = await getAllRoleRequests(token);
        if (data) setRequests(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRequests();
  }, [token, isReNew]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    const comment = status === "rejected" ? prompt("Enter reason:") : "";
    if (!token) return;
    const res = await editRoleRequests(token, id, status, comment);
    if (res) setIsReNew((prev) => !prev);
  };
  const handleDelete = async (id: string) => {
    confirm(t("Are you sure you want to delete this request?"));
    if (!token) return;
    const res = await DeleteRoleRequest(token, id);
    if (res) setIsReNew((prev) => !prev);
  };

  return (
    <div className="p-10">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h1 className="text-2xl font-bold mb-4">
            {t("Role Upgrade Requests")}
          </h1>
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">{t("User")}</th>
                <th className="p-3 border">{t("Requested Role")}</th>
                <th className="p-3 border">{t("Status")}</th>
                <th className="p-3 border text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req: IRoleRequest) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="p-3 border">
                    {req.userId?.firstName} {req.userId?.lastName} <br />
                    <span className="text-xs text-gray-500">
                      {req.userId?.email}
                    </span>
                  </td>
                  <td className="p-3 border uppercase font-bold text-blue-600">
                    {req.requestedRole}
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        req.status === "pending"
                          ? "bg-yellow-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 border align-middle">
                    <div className="flex justify-center gap-2 h-full">
                      {req.status === "pending" ? (
                        <>
                          <Button
                            onClick={() => handleAction(req._id, "approved")}
                            className="bg-green-600 h-8 text-xs"
                          >
                            {t("Approve")}
                          </Button>
                          <Button
                            onClick={() => handleAction(req._id, "rejected")}
                            variant="danger"
                            className="h-8 text-xs"
                          >
                            {t("Reject")}
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleDelete(req._id)}
                          variant="danger"
                          className="h-8 text-xs"
                        >
                          {t("Delete Request")}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
