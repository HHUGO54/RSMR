"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X, ChevronLeft, ChevronRight, Phone, MapPin, Pencil, Plus, Trash2 } from "lucide-react";

interface Rayado {
  id: number;
  nombre: string;
  fechaNac: string | null;
  seccion: number | null;
  distrito: number;
  domicilio: string | null;
  correo: string | null;
  telefono: string | null;
  fecha: string | null;
  monto: string | null;
  notas: string | null;
}

interface Props {
  registros: Rayado[];
  total: number;
  page: number;
  totalPages: number;
  q: string;
  seccion: string;
}

interface EditForm {
  nombre: string;
  fechaNac: string;
  seccion: string;
  domicilio: string;
  correo: string;
  telefono: string;
  fecha: string;
  monto: string;
  notas: string;
}

const EMPTY_FORM: EditForm = {
  nombre: "", fechaNac: "", seccion: "", domicilio: "",
  correo: "", telefono: "", fecha: "", monto: "", notas: "",
};

function EditModal({ registro, onClose, onSaved }: { registro: Rayado | null; onClose: () => void; onSaved: () => void }) {
  const isNew = registro === null;
  const [form, setForm] = useState<EditForm>(
    isNew ? EMPTY_FORM : {
      nombre: registro.nombre,
      fechaNac: registro.fechaNac ?? "",
      seccion: registro.seccion?.toString() ?? "",
      domicilio: registro.domicilio ?? "",
      correo: registro.correo ?? "",
      telefono: registro.telefono ?? "",
      fecha: registro.fecha ?? "",
      monto: registro.monto ?? "",
      notas: registro.notas ?? "",
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function field(key: keyof EditForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(isNew ? "/api/rayado" : `/api/rayado/${registro!.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      onSaved();
    } catch {
      setError("No se pudo guardar el registro");
      setSaving(false);
    }
  }

  const labelClass = "block text-xs font-medium text-gray-600 mb-1";
  const inputClass = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{isNew ? "Nuevo Rayado" : "Editar Rayado"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input className={inputClass} value={form.nombre} onChange={(e) => field("nombre", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Fecha de nacimiento</label>
              <input className={inputClass} value={form.fechaNac} onChange={(e) => field("fechaNac", e.target.value)} placeholder="dd/mm/aaaa" />
            </div>
            <div>
              <label className={labelClass}>Sección</label>
              <input type="number" className={inputClass} value={form.seccion} onChange={(e) => field("seccion", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Domicilio</label>
            <input className={inputClass} value={form.domicilio} onChange={(e) => field("domicilio", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input className={inputClass} value={form.telefono} onChange={(e) => field("telefono", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Correo electrónico</label>
            <input type="email" className={inputClass} value={form.correo} onChange={(e) => field("correo", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Fecha de rayado</label>
              <input className={inputClass} value={form.fecha} onChange={(e) => field("fecha", e.target.value)} placeholder="dd/mm/aaaa" />
            </div>
            <div>
              <label className={labelClass}>Monto</label>
              <input className={inputClass} value={form.monto} onChange={(e) => field("monto", e.target.value)} placeholder="$0.00" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Notas</label>
            <textarea
              className={inputClass + " resize-none"}
              rows={2}
              value={form.notas}
              onChange={(e) => field("notas", e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RayadoClient({ registros, total, page, totalPages, q, seccion }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(q);
  const [seccionFilter, setSeccionFilter] = useState(seccion);
  const [editing, setEditing] = useState<Rayado | null | "new">(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    const values = { q: search, seccion: seccionFilter, page: "1", ...overrides };
    Object.entries(values).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `${pathname}?${params.toString()}`;
  }

  function applyFilters() {
    startTransition(() => router.push(buildUrl({})));
  }

  function clearFilters() {
    setSearch(""); setSeccionFilter("");
    startTransition(() => router.push(pathname));
  }

  function goPage(p: number) {
    startTransition(() => router.push(buildUrl({ page: p.toString() })));
  }

  function handleSaved() {
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      await fetch(`/api/rayado/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  const hasFilters = q || seccion;

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {editing !== null && (
        <EditModal
          registro={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Rayado</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString()} registros</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder="Buscar por nombre, domicilio, notas..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <input
            type="number"
            value={seccionFilter}
            onChange={(e) => setSeccionFilter(e.target.value)}
            placeholder="Sección"
            className="w-full sm:w-28 rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={applyFilters} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Buscar
          </button>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <X size={14} /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla - Desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Sección</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Teléfono</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Fecha</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Monto</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registros.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">Sin resultados</td>
                </tr>
              ) : registros.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.nombre}</p>
                    {r.domicilio && <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">{r.domicilio}</p>}
                    {r.notas && <p className="text-xs text-gray-400 italic mt-0.5">{r.notas}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {r.seccion ? (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{r.seccion}</span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.telefono || "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{r.fecha || "—"}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {r.monto ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">{r.monto}</span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setEditing(r)}
                        className="inline-flex items-center rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deleting === r.id}
                        className="inline-flex items-center rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Móvil */}
      <div className="md:hidden space-y-3">
        {registros.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-200">Sin resultados</div>
        ) : registros.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-gray-900 text-sm leading-tight">{r.nombre}</p>
              <div className="flex items-center gap-1 shrink-0">
                {r.seccion && (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">§{r.seccion}</span>
                )}
                <button
                  onClick={() => setEditing(r)}
                  className="inline-flex items-center rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deleting === r.id}
                  className="inline-flex items-center rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            {r.domicilio && (
              <div className="flex items-start gap-1.5 text-xs text-gray-500">
                <MapPin size={12} className="mt-0.5 shrink-0" />
                <span className="line-clamp-2">{r.domicilio}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {r.telefono && (
                <div className="flex items-center gap-1">
                  <Phone size={12} />
                  <a href={`tel:${r.telefono}`} className="hover:text-blue-600">{r.telefono}</a>
                </div>
              )}
              {r.fecha && <span className="text-gray-400">Fecha: {r.fecha}</span>}
              {r.monto && (
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">{r.monto}</span>
              )}
            </div>
            {r.notas && <p className="text-xs text-gray-400 italic">{r.notas}</p>}
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => goPage(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => goPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
