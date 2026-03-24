"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface Activo {
  id: number;
  nombre: string;
  telefono: string | null;
  movilizacionAsignada: string | null;
}

interface Props {
  activos: Activo[];
  variables: string[];
  filtroVariable: string;
}

export default function MovilizacionDefinirClient({ activos: inicial, variables, filtroVariable }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [asignaciones, setAsignaciones] = useState<Record<number, string | null>>(
    Object.fromEntries(inicial.map((a) => [a.id, a.movilizacionAsignada]))
  );
  const [guardando, setGuardando] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");

  async function asignar(activoId: number, variable: string) {
    const actual = asignaciones[activoId];
    const nueva = actual === variable ? null : variable;
    setAsignaciones((prev) => ({ ...prev, [activoId]: nueva }));
    setGuardando(activoId);
    await fetch(`/api/movilizacion/definir/${activoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movilizacionAsignada: nueva }),
    });
    setGuardando(null);
    startTransition(() => router.refresh());
  }

  const visibles = inicial.filter((a) => {
    if (asignaciones[a.id]) return false;
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return a.nombre.toLowerCase().includes(q) || (a.telefono ?? "").includes(q);
  });

  const totalAsignados = Object.values(asignaciones).filter(Boolean).length;

  if (variables.length === 0) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Movilización</p>
          <h1 className="text-2xl font-bold text-gray-900">Definir</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <p className="font-medium">No hay movilizadores definidos</p>
          <p className="text-sm mt-1">Agrégalos en <span className="text-blue-600 font-medium">Movilización › Movilizadores</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Movilización</p>
          <h1 className="text-2xl font-bold text-gray-900">Definir</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Miembros de <span className="font-semibold text-blue-600">{filtroVariable}</span> · {inicial.length} registros
          </p>
        </div>
        <div className="text-right bg-white border border-gray-200 rounded-xl px-4 py-2">
          <p className="text-xs text-gray-400">Asignados</p>
          <p className="text-xl font-bold text-blue-600">{totalAsignados}</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o teléfono..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide w-36">Teléfono</th>
              {variables.map((v) => (
                <th key={v} className="px-3 py-3 font-semibold text-blue-600 text-xs uppercase tracking-wide text-center w-20">{v}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visibles.length === 0 ? (
              <tr>
                <td colSpan={2 + variables.length} className="text-center py-10 text-gray-400 text-sm">
                  {inicial.length === 0
                    ? `No hay miembros con variable "${filtroVariable}" asignada`
                    : "Todos asignados o sin coincidencias"}
                </td>
              </tr>
            ) : visibles.map((a) => {
              const asignada = asignaciones[a.id];
              const cargando = guardando === a.id;
              return (
                <tr key={a.id} className={`transition-colors hover:bg-gray-50 ${cargando ? "opacity-50" : ""}`}>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{a.nombre}</td>
                  <td className="px-4 py-2.5 text-gray-400">{a.telefono || "—"}</td>
                  {variables.map((v) => {
                    const seleccionado = asignada === v;
                    return (
                      <td key={v} className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => !cargando && asignar(a.id, v)}
                          className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                            seleccionado
                              ? "border-blue-600 bg-blue-600 text-white shadow scale-110"
                              : "border-gray-200 bg-white text-transparent hover:border-blue-400"
                          }`}
                        >
                          ✓
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
