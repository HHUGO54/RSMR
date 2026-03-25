"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { SidebarContext } from "./SidebarContext";
import Sidebar from "./Sidebar";

export default function DashboardShell({ children, role }: { children: React.ReactNode; role: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((p) => !p);
  const close = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Overlay móvil */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={close}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar role={role} />
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Barra superior móvil */}
          <header className="flex h-14 items-center border-b border-gray-200 bg-white px-4 lg:hidden">
            <button
              onClick={toggle}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <span className="ml-3 text-base font-semibold text-gray-900">RSBMR</span>
          </header>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
