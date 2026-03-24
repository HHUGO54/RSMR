"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, RotateCcw, Trash2 } from "lucide-react";

interface Tarea {
  id: number;
  texto: string;
  nota: string | null;
  completada: boolean;
  equipoId: number;
}

interface Equipo {
  id: number;
  variable: string;
  tareas: Tarea[];
}

function EquipoCard({ item }: { item: Equipo }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [tareas, setTareas] = useState<Tarea[]>(item.tareas);

  async function revertir(id: number) {
    setTareas((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tareas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completada: false }),
    });
    router.refresh();
  }

  async function eliminar(id: number) {
    setTareas((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tareas/${id}`, { method: "DELETE" });
  }

  if (tareas.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-50 border border-green-100 px-3 py-1.5">
            <p className="text-sm font-semibold text-green-800">{item.variable}</p>
          </div>
          <span className="text-xs text-gray-400">{tareas.length} {tareas.length === 1 ? "tarea" : "tareas"}</span>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="divide-y divide-gray-100">
          {tareas.map((t) => (
            <div key={t.id} className="flex items-start gap-3 px-4 py-3 bg-green-50/30">
              {/* Check completado */}
              <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Texto + nota */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 line-through leading-snug">{t.texto}</p>
                {t.nota && <p className="text-xs text-gray-400 mt-0.5">{t.nota}</p>}
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                <button
                  onClick={() => revertir(t.id)}
                  title="Mover de vuelta a Tareas"
                  className="p-1 rounded-lg text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  onClick={() => eliminar(t.id)}
                  title="Eliminar"
                  className="p-1 rounded-lg text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompletasClient({ equipo }: { equipo: Equipo[] }) {
  const total = equipo.reduce((s, e) => s + e.tareas.length, 0);

  if (equipo.length === 0) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Compromisos</p>
          <h1 className="text-2xl font-bold text-gray-900">Completas</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <p className="font-medium">Sin tareas completadas aún</p>
          <p className="text-sm mt-1">Palomea tareas en <span className="text-blue-600 font-medium">Tareas</span> para verlas aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Compromisos</p>
          <h1 className="text-2xl font-bold text-gray-900">Completas</h1>
        </div>
        <span className="text-sm font-semibold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-xl">
          {total} {total === 1 ? "tarea" : "tareas"}
        </span>
      </div>

      <div className="space-y-3">
        {equipo.map((item) => (
          <EquipoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
