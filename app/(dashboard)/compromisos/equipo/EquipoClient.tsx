"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Pencil, Trash2 } from "lucide-react";

interface Item {
  id: number;
  variable: string;
  notas: string | null;
}

interface FormState { variable: string; notas: string; }
const EMPTY: FormState = { variable: "", notas: "" };

function Modal({ initial, title, onClose, onSave }: {
  initial: FormState;
  title: string;
  onClose: () => void;
  onSave: (data: FormState) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.variable.trim()) { setError("El valor es obligatorio"); return; }
    setSaving(true);
    setError("");
    try { await onSave(form); } catch { setError("No se pudo guardar"); setSaving(false); }
  }

  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
            <label className="block text-xs font-semibold text-blue-700 mb-1">Variable</label>
            <input
              autoFocus
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={form.variable}
              onChange={(e) => set("variable", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Valor..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notas</label>
            <textarea className={inputClass + " resize-none"} rows={2} value={form.notas} onChange={(e) => set("notas", e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EquipoClient({ equipo, isAdmin }: { equipo: Item[]; isAdmin: boolean }) {
  const router = useRouter();
  const [modal, setModal] = useState<{ mode: "new" } | { mode: "edit"; item: Item } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  function refresh() { setModal(null); router.refresh(); }

  async function handleSaveNew(data: FormState) {
    const res = await fetch("/api/equipo-compromiso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    refresh();
  }

  async function handleSaveEdit(id: number, data: FormState) {
    const res = await fetch(`/api/equipo-compromiso/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    refresh();
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try { await fetch(`/api/equipo-compromiso/${id}`, { method: "DELETE" }); router.refresh(); }
    finally { setDeleting(null); }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {modal?.mode === "new" && (
        <Modal title="Nuevo registro" initial={EMPTY} onClose={() => setModal(null)} onSave={handleSaveNew} />
      )}
      {modal?.mode === "edit" && (
        <Modal
          title="Editar registro"
          initial={{ variable: modal.item.variable, notas: modal.item.notas ?? "" }}
          onClose={() => setModal(null)}
          onSave={(data) => handleSaveEdit(modal.item.id, data)}
        />
      )}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Compromisos</p>
          <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {equipo.length} {equipo.length === 1 ? "registro" : "registros"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal({ mode: "new" })}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Plus size={18} /> Agregar
          </button>
        )}
      </div>

      {equipo.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Plus size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Sin registros aún</p>
          <p className="text-sm text-gray-400 mt-1">Presiona <strong>Agregar</strong> para comenzar</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {equipo.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 flex-1">
                  <p className="text-xs font-medium text-blue-500 mb-0.5">Variable</p>
                  <p className="text-sm font-semibold text-blue-800">{m.variable}</p>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setModal({ mode: "edit", item: m })} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(m.id)} disabled={deleting === m.id} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-40">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
              {m.notas && <p className="text-xs text-gray-400 italic leading-relaxed">{m.notas}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
