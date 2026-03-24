"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Pencil, Plus } from "lucide-react";

interface Activo {
  id: number;
  nombre: string;
  fechaNac: string | null;
  seccion: number | null;
  distrito: number;
  domicilio: string | null;
  correo: string | null;
  telefono: string | null;
  indicador: string | null;
}

interface Props {
  activos: Activo[];
  total: number;
  page: number;
  totalPages: number;
  q: string;
  seccion: string;
  indicador: string;
}

interface EditForm {
  nombre: string;
  fechaNac: string;
  seccion: string;
  domicilio: string;
  correo: string;
  telefono: string;
  indicador: string;
}

function EditModal({ activo, onClose, onSaved }: { activo: Activo | null; onClose: () => void; onSaved: () => void }) {
  const isNew = activo === null;
  const [form, setForm] = useState<EditForm>({
    nombre: activo?.nombre ?? "",
    fechaNac: activo?.fechaNac ?? "",
    seccion: activo?.seccion?.toString() ?? "",
    domicilio: activo?.domicilio ?? "",
    correo: activo?.correo ?? "",
    telefono: activo?.telefono ?? "",
    indicador: activo?.indicador ?? "",
  });
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
      const res = await fetch(isNew ? "/api/activos" : `/api/activos/${activo!.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al guardar");
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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{isNew ? "Nuevo Activo" : "Editar Activo"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
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
          <div>
            <label className={labelClass}>Indicador</label>
            <select className={inputClass} value={form.indicador} onChange={(e) => field("indicador", e.target.value)}>
              <option value="">—</option>
              <option value="SI">SI</option>
              <option value="NO">NO</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        {/* Footer */}
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

export default function ActivosClient({ activos, total, page, totalPages, q, seccion, indicador }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(q);
  const [seccionFilter, setSeccionFilter] = useState(seccion);
  const [indicadorFilter, setIndicadorFilter] = useState(indicador);
  const [editing, setEditing] = useState<Activo | null | "new">(null);

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    const values = { q: search, seccion: seccionFilter, indicador: indicadorFilter, page: "1", ...overrides };
    Object.entries(values).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `${pathname}?${params.toString()}`;
  }

  function applyFilters() {
    startTransition(() => router.push(buildUrl({})));
  }

  function clearFilters() {
    setSearch(""); setSeccionFilter(""); setIndicadorFilter("");
    startTransition(() => router.push(pathname));
  }

  function goPage(p: number) {
    startTransition(() => router.push(buildUrl({ page: p.toString() })));
  }

  function handleSaved() {
    setEditing(null);
    router.refresh();
  }

  const hasFilters = q || seccion || indicador;

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {editing !== null && (
        <EditModal
          activo={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Activos</h1>
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
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder="Buscar por nombre, domicilio, teléfono..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Sección */}
          <input
            type="number"
            value={seccionFilter}
            onChange={(e) => setSeccionFilter(e.target.value)}
            placeholder="Sección"
            className="w-full sm:w-28 rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {/* Indicador */}
          <select
            value={indicadorFilter}
            onChange={(e) => setIndicadorFilter(e.target.value)}
            className="w-full sm:w-32 rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="SI">SI</option>
            <option value="NO">NO</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
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
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Correo</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Indicador</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">Sin resultados</td>
                </tr>
              ) : activos.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{a.nombre}</p>
                    {a.domicilio && (
                      <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">{a.domicilio}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {a.seccion ? (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {a.seccion}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.telefono || "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell truncate max-w-[180px]">
                    {a.correo || "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      a.indicador === "SI"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {a.indicador ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(a)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Móvil */}
      <div className="md:hidden space-y-3">
        {activos.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-200">
            Sin resultados
          </div>
        ) : activos.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-gray-900 text-sm leading-tight">{a.nombre}</p>
              <div className="flex items-center gap-1.5 shrink-0">
                {a.seccion && (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    §{a.seccion}
                  </span>
                )}
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                  a.indicador === "SI" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {a.indicador ?? "—"}
                </span>
                <button
                  onClick={() => setEditing(a)}
                  className="inline-flex items-center rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
                >
                  <Pencil size={13} />
                </button>
              </div>
            </div>
            {a.domicilio && (
              <div className="flex items-start gap-1.5 text-xs text-gray-500">
                <MapPin size={12} className="mt-0.5 shrink-0" />
                <span className="line-clamp-2">{a.domicilio}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {a.telefono && (
                <div className="flex items-center gap-1">
                  <Phone size={12} />
                  <a href={`tel:${a.telefono}`} className="hover:text-blue-600">{a.telefono}</a>
                </div>
              )}
              {a.correo && (
                <div className="flex items-center gap-1">
                  <Mail size={12} />
                  <a href={`mailto:${a.correo}`} className="hover:text-blue-600 truncate max-w-[180px]">{a.correo}</a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            Página {page} de {totalPages}
          </p>
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
