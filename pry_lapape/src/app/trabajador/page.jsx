"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Trabajador() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) return router.replace("/login");
    if ((user.role || "").toUpperCase() !== "TRABAJADOR") return router.replace("/");
  }, [user, loading, router]);

  if (loading) return <div className="p-8">Cargando…</div>;
  return <div className="p-8">Dashboard TRABAJADOR </div>;
}
