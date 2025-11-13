"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/Header";
import Input from "@/components/Inputs";
import { PrimaryButton } from "@/components/Buttons";
import { api, decodeJWT } from "@/lib/api";

export default function Verificar2FA(){
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") || "";
  const [code, setCode] = useState("");

  const onSubmit = async (e)=>{
    e.preventDefault();
    try{
      const res = await api("/auth/verify-2fa", { body: { email, code }});
      localStorage.setItem("token", res.token);
      const payload = decodeJWT(res.token);
      const role = payload?.role || "CLIENTE";
      const path = role === "DUENO" ? "/dueno" : role === "TRABAJADOR" ? "/trabajador" : "/cliente";
      router.push(path);
    }catch(err){ alert(err.message); }
  };

  return (
    <>
      <Header/>
      <section className="max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Verificar código 2FA</h1>
        <p className="text-[#666] mb-4">Revisa tu correo. En modo DEV el código aparece en la consola del backend.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Correo" type="email" value={email} readOnly />
          <Input label="Código" placeholder="123456" value={code} onChange={e=>setCode(e.target.value)} />
          <PrimaryButton className="w-full py-3">Confirmar</PrimaryButton>
        </form>
      </section>
    </>
  );
}
