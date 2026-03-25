"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  UserCheck,
  Settings2,
  BarChart2,
  Truck,
  UserCog,
  Map,
  Layers,
  Handshake,
  ClipboardCheck,
  CalendarDays,
  ChevronDown,
  LogOut,
  X,
  ShieldCheck,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/activos", label: "Activos", icon: Users },
  { href: "/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/usuarios", label: "Usuarios", icon: ShieldCheck },
];

const compromisosItems = [
  { href: "/compromisos/equipo", label: "Equipo", icon: Users },
  { href: "/compromisos/tareas", label: "Tareas", icon: CheckSquare },
  { href: "/compromisos/completas", label: "Completas", icon: ClipboardCheck },
];

const mapaItems = [
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/mapa/secciones", label: "Secciones", icon: Layers },
];

const rayadoItems = [
  { href: "/rayado/aspirantes", label: "Aspirantes", icon: UserCheck },
  { href: "/rayado/definir", label: "Definir", icon: Settings2 },
  { href: "/rayado/grafica", label: "Gráfica", icon: BarChart2 },
];

const movilizacionItems = [
  { href: "/movilizacion/movilizadores", label: "Movilizadores", icon: UserCog },
  { href: "/movilizacion/definir", label: "Definir", icon: Settings2 },
  { href: "/movilizacion/grafica", label: "Gráfica", icon: BarChart2 },
];

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const { close } = useSidebar();
  const isAdmin = role === "ADMIN";

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const isMapaActive = mapaItems.some((i) => isActive(i.href));
  const isRayadoActive = rayadoItems.some((i) => isActive(i.href));
  const isMovilizacionActive = movilizacionItems.some((i) => isActive(i.href));
  const isCompromisosActive = compromisosItems.some((i) => isActive(i.href));

  const [mapaAbierto, setMapaAbierto] = useState(isMapaActive);
  const [rayadoAbierto, setRayadoAbierto] = useState(isRayadoActive);
  const [movilizacionAbierta, setMovilizacionAbierta] = useState(isMovilizacionActive);
  const [compromisosAbierto, setCompromisosAbierto] = useState(isCompromisosActive);

  function NavGroup({
    label, icon: Icon, open, onToggle, items, active,
  }: {
    label: string;
    icon: React.ElementType;
    open: boolean;
    onToggle: () => void;
    items: { href: string; label: string; icon: React.ElementType }[];
    active: boolean;
  }) {
    return (
      <div className="pt-2">
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active ? "text-blue-400 hover:bg-gray-800" : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Icon size={18} />
          <span className="flex-1 text-left">{label}</span>
          <ChevronDown size={15} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="mt-0.5 space-y-0.5 pl-4">
            {items.map(({ href, label: itemLabel, icon: ItemIcon }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(href) ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <ItemIcon size={16} />
                {itemLabel}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-sm">
          R
        </div>
        <span className="text-lg font-semibold">RSBMR</span>
        <button
          onClick={close}
          className="ml-auto rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.filter(item => item.href !== "/usuarios" || isAdmin).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={close}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(href) ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}

        <NavGroup
          label="Mapa"
          icon={Map}
          open={mapaAbierto}
          onToggle={() => setMapaAbierto((v) => !v)}
          items={mapaItems}
          active={isMapaActive}
        />

        <NavGroup
          label="Rayado"
          icon={CheckSquare}
          open={rayadoAbierto}
          onToggle={() => setRayadoAbierto((v) => !v)}
          items={rayadoItems}
          active={isRayadoActive}
        />

        <NavGroup
          label="Movilización"
          icon={Truck}
          open={movilizacionAbierta}
          onToggle={() => setMovilizacionAbierta((v) => !v)}
          items={movilizacionItems}
          active={isMovilizacionActive}
        />

        <NavGroup
          label="Compromisos"
          icon={Handshake}
          open={compromisosAbierto}
          onToggle={() => setCompromisosAbierto((v) => !v)}
          items={compromisosItems}
          active={isCompromisosActive}
        />
      </nav>

      <div className="border-t border-gray-700 p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
