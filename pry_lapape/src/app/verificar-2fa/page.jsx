"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Input from "@/components/Inputs";
import { PrimaryButton } from "@/components/Buttons";
import { api, decodeJWT } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export default function Verificar2FA() {
  const params = useSearchParams();
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const initialEmail = params.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pending-2fa");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.email) setEmail(parsed.email);
      if (typeof parsed.remember === "boolean") setRemember(parsed.remember);
      if (parsed.user) setPendingUser(parsed.user);
    } catch (err) {
      console.warn("No se pudo leer el estado pendiente de 2FA", err);
    }
  }, []);

  const normalizeUser = (rawUser, fallbackEmail, token) => {
    const payload = token ? decodeJWT(token) : {};
    const role =
      (rawUser?.role || rawUser?.rol || payload?.role || payload?.rol || "CLIENTE").toUpperCase();

    return {
      id: rawUser?.id || payload?.id || payload?._id || "",
      nombre: rawUser?.nombre || payload?.nombre || "",
      email: rawUser?.email || payload?.email || fallbackEmail,
      role,
      rol: role,
      isVerified: rawUser?.isVerified ?? payload?.isVerified ?? true,
      twoFAEnabled: rawUser?.twoFAEnabled ?? payload?.twoFAEnabled ?? false,
      lastLoginAt: rawUser?.lastLoginAt || payload?.lastLoginAt || null,
    };
  };

  const goToDashboard = (role) => {
    const normalized = (role || "").toUpperCase();
    if (normalized === "DUENO" || normalized === "ADMIN") {
      router.push("/dueño");
    } else if (normalized === "TRABAJADOR" || normalized === "EMPLEADO") {
      router.push("/trabajador");
    } else {
      router.push("/cliente");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !code) {
      alert("Debes ingresar el correo y el código enviado.");
      return;
    }

    try {
      setLoading(true);
      const res = await api("/auth/verify-2fa", { body: { email, code } });
      const user = normalizeUser(res.user || pendingUser, email, res.token);
      authLogin({ user, token: res.token, remember });
      try {
        sessionStorage.removeItem("pending-2fa");
      } catch (storageErr) {
        console.warn("No se pudo limpiar el estado pendiente de 2FA", storageErr);
      }
      goToDashboard(user.role || user.rol);
    } catch (err) {
      alert(err.message || "Error al validar el código 2FA");
    } finally {
      setLoading(false);
    }
  };

  const hasPrefilledEmail = Boolean(initialEmail || pendingUser?.email);

  return (
    <>
      <Header />
      <section className="max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Verificar código 2FA</h1>
        <p className="text-[#666] mb-4">
          Revisa tu correo. En modo DEV el código aparece en la consola del backend.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Correo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={hasPrefilledEmail}
          />
          <Input
            label="Código"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <PrimaryButton className="w-full py-3" type="submit" disabled={loading}>
            {loading ? "Validando..." : "Confirmar"}
          </PrimaryButton>
        </form>
      </section>
    </>
  );
}
