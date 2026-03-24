"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, MapPin } from "lucide-react";
import Link from "next/link";

interface Activo {
  id: number;
  nombre: string;
  telefono: string | null;
  seccion: number | null;
  domicilio: string | null;
  movilizacionAsignada: string | null;
}

interface Props {
  variable: string;
  activos: Activo[];
  variables: string[];
}

export default function MovVariableDetalleClient({ variable, activos: inicial, variables }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [asignaciones, setAsignaciones] = useState<Record<number, string | null>>(
    Object.fromEntries(inicial.map((a) => [a.id, a.movilizacionAsignada]))
  );
  const [guardando, setGuardando] = useState<number | null>(null);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);

  async function cambiarVariable(activoId: number, nueva: string | null) {
    setAsignaciones((prev) => ({ ...prev, [activoId]: nueva }));
    setSeleccionado(null);
    setGuardando(activoId);
    await fetch(`/api/movilizacion/definir/${activoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movilizacionAsignada: nueva }),
    });
    setGuardando(null);
    startTransition(() => router.refresh());
  }

  const activos = inicial.filter((a) => asignaciones[a.id] === variable);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/movilizacion/grafica" className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Movilización · Gráfica</p>
          <h1 className="text-2xl font-bold text-gray-900">{variable}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{activos.length} miembros — toca un nombre para cambiar su movilizador</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-50">
        {activos.length === 0 && (
          <p className="text-center py-10 text-gray-400 text-sm">Sin miembros en este movilizador</p>
        )}
        {activos.map((a, i) => {
          const abierto = seleccionado === a.id;
          const cargando = guardando === a.id;
          return (
            <div key={a.id} className={`transition-colors ${cargando ? "opacity-50" : ""}`}>
              <button
                onClick={() => setSeleccionado(abierto ? null : a.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-xs text-gray-300 w-5 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{a.nombre}</p>
                  <div className="flex flex-wrap gap-3 mt-0.5">
                    {a.telefono && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Phone size={10} /> {a.telefono}
                      </span>
                    )}
                    {a.domicilio && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={10} /> {a.domicilio}
                      </span>
                    )}
                  </div>
                </div>
                {a.seccion && (
                  <span className="shrink-0 inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">§{a.seccion}</span>
                )}
                <span className={`text-xs transition-transform ${abierto ? "rotate-180" : ""} text-gray-300`}>▼</span>
              </button>

              {abierto && (
                <div className="px-4 pb-4 pt-1 bg-blue-50 border-t border-blue-100">
                  <p className="text-xs font-semibold text-blue-600 mb-2">Cambiar a:</p>
                  <div className="flex flex-wrap gap-2">
                    {variables.filter((v) => v !== variable).map((v) => (
                      <button
                        key={v}
                        onClick={() => cambiarVariable(a.id, v)}
                        className="rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                      >
                        {v}
                      </button>
                    ))}
                    <button
                      onClick={() => cambiarVariable(a.id, null)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                      Quitar asignación
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
