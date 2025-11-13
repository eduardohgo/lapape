"use client";
import Header from "@/components/Header";
import { ordersGet } from "@/lib/storage";
import { useRouter } from "next/navigation";

export default function PedidosPage(){
  const router = useRouter();
  const orders = ordersGet();

  return (
    <>
      <Header/>
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-4">Mis pedidos</h1>
        {orders.length === 0 && <p className="text-sm text-[#666]">Aún no tienes pedidos.</p>}
        <div className="grid gap-3">
          {orders.map(o => (
            <div key={o.folio} className="p-4 border rounded-lg bg-white flex items-center justify-between">
              <div>
                <div className="font-semibold">{o.folio}</div>
                <div className="text-sm text-[#666]">{new Date(o.date).toLocaleString()} — ${o.total}</div>
              </div>
              <button onClick={()=>router.push(`/perfil/pedidos/${o.folio}`)} className="px-3 py-2 rounded border">Ver detalle</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
