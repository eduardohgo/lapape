"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { UserPlus, LogIn, ShoppingCart, Search, Menu } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./Buttons";

function BrandBadge() {
  return (
    <Link href="/" className="flex items-center group">
      {/* LOGO: EXTRA GRANDE y destacado */}
      <div className="
        h-20 w-20 md:h-32 md:w-32
        rounded-3xl md:rounded-[32px]
        p-2 md:p-4
        bg-gradient-to-br from-[#FFD54F] to-[#FFB300]
        shadow-xl ring-2 ring-[#FFD54F]/20
        overflow-hidden
        transition-all duration-300 
        hover:shadow-2xl hover:scale-[1.08] hover:ring-[#FFD54F]/40
        group-hover:rotate-3
      ">
        <div className="w-full h-full bg-white/90 rounded-2xl flex items-center justify-center p-1">
          <Image
            src="/logo-lapape.png.jpg"
            alt="La Pape - Papelería Creativa"
            width={128}
            height={128}
            sizes="(max-width: 768px) 80px, 128px"
            quality={100}
            className="h-full w-full object-contain drop-shadow-sm"
            priority
          />
        </div>
      </div>
    </Link>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#F0F0F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo SOLO - Sin texto */}
          <BrandBadge />

          {/* Navegación principal - Desktop */}
          <nav className="hidden lg:flex items-center gap-9 ml-12">
            {[
              { href: "/", label: "Inicio" },
              { href: "/catalogo", label: "Catálogo" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/contacto", label: "Contacto" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-semibold text-[#333333] hover:text-[#4A90E2] transition-colors relative py-2 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4A90E2] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Búsqueda - Desktop */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <label className="flex items-center gap-3 h-12 px-4 rounded-2xl border-2 border-[#E0E0E0] bg-white hover:border-[#4A90E2] transition-colors focus-within:border-[#4A90E2] focus-within:shadow-sm">
                <Search size={18} className="text-[#666666]" />
                <input
                  className="outline-none flex-1 text-[#1C1C1C] placeholder-[#6B7280] bg-transparent"
                  placeholder="Buscar productos..."
                />
              </label>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <Link
              href="/carrito"
              className="relative p-3 rounded-2xl bg-[#FFF9E6] text-[#1C1C1C] hover:bg-[#FFD54F] transition-colors duration-200 group"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EC5DBB] text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm">
                3
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <SecondaryButton className="flex items-center gap-2 px-4 py-2">
                  <LogIn size={16} />
                  <span>Entrar</span>
                </SecondaryButton>
              </Link>
              <Link href="/registro">
                <PrimaryButton className="flex items-center gap-2 px-4 py-2">
                  <UserPlus size={16} />
                  <span>Registro</span>
                </PrimaryButton>
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-xl border border-[#E0E0E0] bg-white hover:bg-[#FFF9E6] transition-colors"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              <Menu size={20} className="text-[#1C1C1C]" />
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-6 bg-white rounded-2xl border border-[#F0F0F0] shadow-lg space-y-4">
            <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border-2 border-[#E0E0E0] bg-white">
              <Search size={18} className="text-[#666666]" />
              <input
                className="outline-none flex-1 text-[#1C1C1C] placeholder-[#6B7280] bg-transparent"
                placeholder="Buscar productos..."
              />
            </div>

            <nav className="space-y-3">
              {[
                { href: "/", label: "Inicio" },
                { href: "/catalogo", label: "Catálogo" },
                { href: "/nosotros", label: "Nosotros" },
                { href: "/contacto", label: "Contacto" },
                { href: "/carrito", label: "Carrito" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block font-semibold text-[#333333] hover:text-[#4A90E2] transition-colors py-2 border-b border-[#F0F0F0]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 pt-4">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <SecondaryButton className="w-full flex items-center justify-center gap-2 py-3">
                  <LogIn size={16} />
                  Iniciar sesión
                </SecondaryButton>
              </Link>
              <Link href="/registro" onClick={() => setIsMenuOpen(false)}>
                <PrimaryButton className="w-full flex items-center justify-center gap-2 py-3">
                  <UserPlus size={16} />
                  Crear cuenta
                </PrimaryButton>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}