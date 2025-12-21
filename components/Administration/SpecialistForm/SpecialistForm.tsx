"use client";

import { useState } from "react";
import { ISpecialist } from "@/helper/types/specialist";
import { MultilangString } from "@/helper/types/common";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";
import {
  createSpecialist,
  updateSpecialist,
} from "@/helper/api/viewSpecialistData";

const langs = ["uk", "en", "nl", "de"] as const;

const emptyML = (): MultilangString => ({
  uk: "",
  en: "",
  nl: "",
  de: "",
});

export const SpecialistForm = ({
  specialist,
  onSaved,
}: {
  specialist: ISpecialist | null;
  onSaved: () => void;
}) => {
  const [activeLang, setActiveLang] = useState<(typeof langs)[number]>("uk");

  const [form, setForm] = useState<ISpecialist>({
    isActive: specialist?.isActive ?? true,
    name: specialist?.name ?? emptyML(),
    specialty: specialist?.specialty ?? emptyML(),
    education: specialist?.education ?? emptyML(),
    description: specialist?.description ?? emptyML(),
    imageUrl: specialist?.imageUrl ?? "",
    phone: specialist?.phone ?? "",
    instagram: specialist?.instagram ?? "",
    minOrder: specialist?.minOrder ?? "",
    languages: specialist?.languages ?? [],
  });

  const handleMLChange = (
    field: keyof Pick<
      ISpecialist,
      "name" | "specialty" | "education" | "description"
    >,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as MultilangString),
        [activeLang]: value,
      },
    }));
  };

  const save = async () => {
    if (specialist?._id) {
      await updateSpecialist(specialist._id, form);
    } else {
      await createSpecialist(form);
    }
    onSaved();
  };

  return (
    <div className="space-y-6">
      {/* LANG TABS */}
      <div className="flex gap-2">
        {langs.map((l) => (
          <Button
            key={l}
            type="button"
            variant={activeLang === l ? "primary" : "secondary"}
            onClick={() => setActiveLang(l)}
          >
            {l.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* MULTILANG FIELDS */}
      <Input
        label={`Name (${activeLang})`}
        id={`Name (${activeLang})`}
        value={form.name[activeLang]}
        onChange={(e) => handleMLChange("name", e.target.value)}
      />

      <Input
        label={`Specialty (${activeLang})`}
        id={`Specialty (${activeLang})`}
        value={form.specialty[activeLang]}
        onChange={(e) => handleMLChange("specialty", e.target.value)}
      />

      <Input
        label={`Education (${activeLang})`}
        id={`Education (${activeLang})`}
        value={form.education?.[activeLang] || ""}
        onChange={(e) => handleMLChange("education", e.target.value)}
      />

      <Input
        label={`Description (${activeLang})`}
        id={`Description (${activeLang})`}
        value={form.description?.[activeLang] || ""}
        onChange={(e) => handleMLChange("description", e.target.value)}
      />

      {/* COMMON */}
      <Input
        label="Phone"
        id="Phone"
        value={form.phone || ""}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <Input
        label="Instagram"
        id="Instagram"
        value={form.instagram || ""}
        onChange={(e) => setForm({ ...form, instagram: e.target.value })}
      />

      <Input
        label="Min order"
        id="Min order"
        value={form.minOrder || ""}
        onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
      />

      <Button onClick={save}>Save</Button>
    </div>
  );
};
