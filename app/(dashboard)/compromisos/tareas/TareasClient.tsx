"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";

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
  notas: string | null;
  tareas: Tarea[];
}

function TareaRow({ tarea, onToggle, onDelete, onUpdateNota }: {
  tarea: Tarea;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateNota: (nota: string) => void;
}) {
  const [notaEdit, setNotaEdit] = useState(tarea.nota ?? "");
  const [saving, setSaving] = useState(false);

  async function handleNotaBlur() {
    if (notaEdit === (tarea.nota ?? "")) return;
    setSaving(true);
    await fetch(`/api/tareas/${tarea.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nota: notaEdit }),
    });
    onUpdateNota(notaEdit);
    setSaving(false);
  }

  return (
    <div className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${tarea.completada ? "bg-gray-50" : "bg-white"}`}>
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          tarea.completada
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 hover:border-green-400"
        }`}
      >
        {tarea.completada && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Tarea + nota */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${tarea.completada ? "line-through text-gray-400" : "text-gray-900"}`}>
          {tarea.texto}
        </p>
        <input
          type="text"
          value={notaEdit}
          onChange={(e) => setNotaEdit(e.target.value)}
          onBlur={handleNotaBlur}
          placeholder="Agregar nota..."
          className={`mt-1 w-full text-xs bg-transparent border-0 border-b border-dashed focus:outline-none focus:border-blue-400 transition-colors placeholder:text-gray-300 ${
            tarea.completada ? "text-gray-400 border-gray-200" : "text-gray-500 border-gray-200"
          } ${saving ? "opacity-50" : ""}`}
        />
      </div>

      {/* Eliminar */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 mt-0.5 p-1 rounded-lg text-gray-300 hover:text-red-500 transition-colors"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function EquipoCard({ item }: { item: Equipo }) {
  const [open, setOpen] = useState(true);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [adding, setAdding] = useState(false);
  const [tareas, setTareas] = useState<Tarea[]>(item.tareas);

  const completadas = tareas.filter((t) => t.completada).length;

  async function addTarea() {
    if (!nuevaTarea.trim()) return;
    setAdding(true);
    const res = await fetch("/api/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equipoId: item.id, texto: nuevaTarea.trim(), nota: "" }),
    });
    const nueva: Tarea = await res.json();
    setTareas((prev) => [...prev, nueva]);
    setNuevaTarea("");
    setAdding(false);
  }

  async function toggleTarea(id: number) {
    setTareas((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tareas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completada: true }),
    });
  }

  async function deleteTarea(id: number) {
    setTareas((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tareas/${id}`, { method: "DELETE" });
  }

  function updateNota(id: number, nota: string) {
    setTareas((prev) => prev.map((t) => t.id === id ? { ...t, nota } : t));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-1.5">
            <p className="text-sm font-semibold text-blue-800">{item.variable}</p>
          </div>
          {tareas.length > 0 && (
            <span className="text-xs text-gray-400">
              {completadas}/{tareas.length} completadas
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Barra de progreso */}
      {tareas.length > 0 && (
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-green-500 transition-all duration-300"
            style={{ width: `${(completadas / tareas.length) * 100}%` }}
          />
        </div>
      )}

      {/* Lista de tareas */}
      {open && (
        <>
          {tareas.length === 0 && (
            <p className="px-5 py-4 text-sm text-gray-400 text-center">Sin tareas aún</p>
          )}
          {tareas.map((t) => (
            <TareaRow
              key={t.id}
              tarea={t}
              onToggle={() => toggleTarea(t.id)}
              onDelete={() => deleteTarea(t.id)}
              onUpdateNota={(nota) => updateNota(t.id, nota)}
            />
          ))}

          {/* Input nueva tarea */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50">
            <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-dashed border-gray-300" />
            <input
              type="text"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTarea()}
              placeholder="Nueva tarea..."
              className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400"
            />
            <button
              onClick={addTarea}
              disabled={adding || !nuevaTarea.trim()}
              className="flex-shrink-0 rounded-lg bg-blue-600 p-1.5 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function TareasClient({ equipo }: { equipo: Equipo[] }) {
  if (equipo.length === 0) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Compromisos</p>
          <h1 className="text-2xl font-bold text-gray-900">Tareas</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <p className="font-medium">Sin equipo registrado</p>
          <p className="text-sm mt-1">Agrega variables en <span className="text-blue-600 font-medium">Equipo</span> para crear tareas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Compromisos</p>
        <h1 className="text-2xl font-bold text-gray-900">Tareas</h1>
      </div>

      <div className="space-y-3">
        {equipo.map((item) => (
          <EquipoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
