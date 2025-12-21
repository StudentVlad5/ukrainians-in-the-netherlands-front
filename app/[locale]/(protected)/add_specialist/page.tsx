"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/UI/Card/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/Dialog/dialog";
import { Button } from "@/components/UI/Button/Button";
import Image from "next/image";
import Cookies from "js-cookie";

import { ISpecialist } from "@/helper/types/specialist";
import {
  getSpecialists,
  deleteSpecialist,
} from "@/helper/api/viewSpecialistData";
import { SpecialistForm } from "@/components/Administration/SpecialistForm/SpecialistForm";
import { checkToken } from "@/helper/api/checkTocken";
import { useRouter } from "next/navigation";
import { refreshUserProfile } from "@/helper/api/viewProfileData";

export default function SpecialistsDashboardPage() {
  const [items, setItems] = useState<ISpecialist[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ISpecialist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = checkToken(router);

      try {
        const data = await refreshUserProfile(token);
        if (data.role !== "seller" && data.role !== "admin") {
          router.push("/profile");
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const fetchData = useCallback(async () => {
    const token = Cookies.get("accessToken");
    if (!token) return;
    const data = await getSpecialists(token);
    setItems(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item: ISpecialist) => {
    setEditing(item);
    setModalOpen(true);
  };

  const remove = async (id?: string) => {
    if (!id) return;
    const token = Cookies.get("accessToken");
    if (!token) return;

    await deleteSpecialist(token, id);
    fetchData();
  };

  return (
    <div className="p-10">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Specialists</h1>
            <Button onClick={openCreate}>Add Specialist</Button>
          </div>

          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Image</th>
                <th className="p-2">Name (UA)</th>
                <th className="p-2">Specialty</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-2">
                    {s.imageUrl && (
                      <Image src={s.imageUrl} width={50} height={50} alt="" />
                    )}
                  </td>
                  <td className="p-2">{s.name.uk}</td>
                  <td className="p-2">{s.specialty.uk}</td>
                  <td className="p-2">{s.isActive ? "Active" : "Hidden"}</td>
                  <td className="p-2 flex gap-2">
                    <Button onClick={() => openEdit(s)}>Edit</Button>
                    <Button
                      className="bg-red-600 text-white"
                      onClick={() => remove(s._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Specialist" : "Create Specialist"}
            </DialogTitle>
          </DialogHeader>

          <SpecialistForm
            key={editing?._id || "new"}
            specialist={editing}
            onSaved={() => {
              setModalOpen(false);
              fetchData();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
