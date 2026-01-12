"use client";
import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRootPage() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.push("/profile/personal");
  }, [router]);

  return null;
}
