"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Input from "@/components/Inputs";
import { PrimaryButton } from "@/components/Buttons";
import { api } from "@/lib/api";

export default function VerificarCorreoPage(){
  const params = useSearchParams();
  const router = useRouter();
  const emailQ = params.get("email") || "";
  const codeQ = params.get("code") || "";
  const [email, setEmail] = useState(emailQ);
  const [code, setCode]   = useState(codeQ);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ if (emailQ) setEmail(emailQ); if(codeQ) setCode(codeQ); }, [emailQ, codeQ]);

  const onSubmit = async (e)=>{
    e.preventDefault();
    try{
      setLoading(true);
      await api("/auth/verify-email", { body: { email, code }});
      alert("Correo verificado. Ya puedes iniciar sesión.");
      router.push(`/login?email=${encodeURIComponent(email)}`);
    }catch(err){ alert(err.message); }
    finally{ setLoading(false); }
  };

  return (
    <>
      <Header/>
      <section className="max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Verificar correo</h1>
        <p className="text-[#666] mb-4">Ingresa el código que recibiste para confirmar tu cuenta.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Correo" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input label="Código" placeholder="123456" value={code} onChange={e=>setCode(e.target.value)} />
          <PrimaryButton className="w-full py-3" disabled={loading}>{loading ? "Verificando..." : "Verificar"}</PrimaryButton>
        </form>
      </section>
    </>
  );
}
