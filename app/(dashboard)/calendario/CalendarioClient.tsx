"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, X, MapPin, Clock, User, Phone, FileText, Pencil, Trash2 } from "lucide-react";

interface Evento {
  id: number;
  titulo: string;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  descripcion: string | null;
  responsable: string | null;
  contacto: string | null;
  telefono: string | null;
}

interface FormState {
  titulo: string; fecha: string; hora: string;
  lugar: string; descripcion: string;
  responsable: string; contacto: string; telefono: string;
}

const EMPTY = (fecha = ""): FormState => ({
  titulo: "", fecha, hora: "", lugar: "",
  descripcion: "", responsable: "", contacto: "", telefono: "",
});

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function Modal({ initial, title, onClose, onSave }: {
  initial: FormState; title: string;
  onClose: () => void;
  onSave: (d: FormState) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(k: keyof FormState, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave() {
    if (!form.titulo.trim()) { setError("El título es obligatorio"); return; }
    if (!form.fecha)         { setError("La fecha es obligatoria"); return; }
    setSaving(true); setError("");
    try { await onSave(form); } catch { setError("No se pudo guardar"); setSaving(false); }
  }

  const inp = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="px-5 py-4 space-y-3 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Título *</label>
            <input autoFocus className={inp} value={form.titulo} onChange={e => set("titulo", e.target.value)} placeholder="Nombre del evento..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fecha *</label>
              <input type="date" className={inp} value={form.fecha} onChange={e => set("fecha", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hora</label>
              <input type="time" className={inp} value={form.hora} onChange={e => set("hora", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Lugar</label>
            <input className={inp} value={form.lugar} onChange={e => set("lugar", e.target.value)} placeholder="Dirección o nombre del lugar..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
            <textarea className={inp + " resize-none"} rows={2} value={form.descripcion} onChange={e => set("descripcion", e.target.value)} placeholder="Detalles del evento..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Responsable</label>
              <input className={inp} value={form.responsable} onChange={e => set("responsable", e.target.value)} placeholder="Nombre..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contacto</label>
              <input className={inp} value={form.contacto} onChange={e => set("contacto", e.target.value)} placeholder="Nombre..." />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
            <input type="tel" className={inp} value={form.telefono} onChange={e => set("telefono", e.target.value)} placeholder="664 000 0000" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 px-5 pb-5 pt-2">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventoDetalle({ evento, onEdit, onDelete, onClose, isAdmin }: {
  evento: Evento; onEdit: () => void; onDelete: () => void; onClose: () => void; isAdmin: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{evento.fecha}{evento.hora ? ` · ${evento.hora}` : ""}</p>
            <h2 className="text-base font-semibold text-gray-900">{evento.titulo}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5"><X size={20} /></button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {evento.lugar && (
            <div className="flex items-start gap-2">
              <MapPin size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{evento.lugar}</p>
            </div>
          )}
          {evento.hora && (
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-700">{evento.hora}</p>
            </div>
          )}
          {evento.descripcion && (
            <div className="flex items-start gap-2">
              <FileText size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{evento.descripcion}</p>
            </div>
          )}
          {evento.responsable && (
            <div className="flex items-center gap-2">
              <User size={15} className="text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-700"><span className="text-gray-400">Responsable:</span> {evento.responsable}</p>
            </div>
          )}
          {evento.contacto && (
            <div className="flex items-center gap-2">
              <User size={15} className="text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-700"><span className="text-gray-400">Contacto:</span> {evento.contacto}</p>
            </div>
          )}
          {evento.telefono && (
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-700">{evento.telefono}</p>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center px-5 pb-5">
          {isAdmin ? (
            <button onClick={onDelete} className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 size={14} /> Eliminar
            </button>
          ) : <div />}
          {isAdmin && (
            <button onClick={onEdit} className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              <Pencil size={14} /> Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const ELECCION = new Date("2027-06-06T00:00:00");

function Countdown() {
  const [diff, setDiff] = useState(() => ELECCION.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setDiff(ELECCION.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const total = Math.max(0, diff);
  const days  = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const mins  = Math.floor((total % 3600000)  / 60000);
  const secs  = Math.floor((total % 60000)    / 1000);

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl px-6 py-5 text-white shadow-md">
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-3">Tiempo para la elección — 6 Jun 2027</p>
      <div className="flex items-end gap-4">
        {[
          { v: days,  l: "días" },
          { v: hours, l: "horas" },
          { v: mins,  l: "min" },
          { v: secs,  l: "seg" },
        ].map(({ v, l }) => (
          <div key={l} className="text-center">
            <span className="text-4xl font-bold tabular-nums leading-none">{String(v).padStart(2, "0")}</span>
            <p className="text-xs text-blue-200 mt-1">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarioClient({ eventosInit, isAdmin }: { eventosInit: Evento[]; isAdmin: boolean }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [eventos, setEventos] = useState<Evento[]>(eventosInit);
  const [modal, setModal] = useState<{ mode: "new"; fecha: string } | { mode: "edit"; evento: Evento } | null>(null);
  const [detalle, setDetalle] = useState<Evento | null>(null);

  // Días del mes
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  function toDateStr(d: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function eventosDelDia(d: number) {
    const ds = toDateStr(d);
    return eventos.filter(e => e.fecha === ds);
  }

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function nextMonth() { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }

  async function handleSaveNew(data: FormState) {
    const res = await fetch("/api/eventos", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    const nuevo: Evento = await res.json();
    setEventos(prev => [...prev, nuevo].sort((a, b) => a.fecha.localeCompare(b.fecha)));
    setModal(null);
  }

  async function handleSaveEdit(id: number, data: FormState) {
    const res = await fetch(`/api/eventos/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    const updated: Evento = await res.json();
    setEventos(prev => prev.map(e => e.id === id ? updated : e));
    setModal(null); setDetalle(null);
  }

  async function handleDelete(id: number) {
    await fetch(`/api/eventos/${id}`, { method: "DELETE" });
    setEventos(prev => prev.filter(e => e.id !== id));
    setDetalle(null);
  }

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // Próximos eventos (a partir de hoy)
  const todayStr = today.toISOString().slice(0, 10);
  const proximos = eventos.filter(e => e.fecha >= todayStr).slice(0, 5);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <Countdown />

      {/* Modal nuevo/editar */}
      {modal?.mode === "new" && (
        <Modal title="Nuevo evento" initial={EMPTY(modal.fecha)} onClose={() => setModal(null)} onSave={handleSaveNew} />
      )}
      {modal?.mode === "edit" && (
        <Modal
          title="Editar evento"
          initial={{ titulo: modal.evento.titulo, fecha: modal.evento.fecha, hora: modal.evento.hora ?? "",
            lugar: modal.evento.lugar ?? "", descripcion: modal.evento.descripcion ?? "",
            responsable: modal.evento.responsable ?? "", contacto: modal.evento.contacto ?? "",
            telefono: modal.evento.telefono ?? "" }}
          onClose={() => setModal(null)}
          onSave={data => handleSaveEdit(modal.evento.id, data)}
        />
      )}
      {detalle && !modal && (
        <EventoDetalle
          evento={detalle}
          isAdmin={isAdmin}
          onClose={() => setDetalle(null)}
          onEdit={() => { setModal({ mode: "edit", evento: detalle }); setDetalle(null); }}
          onDelete={() => handleDelete(detalle.id)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
          <p className="text-sm text-gray-500 mt-0.5">Distrito 09</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal({ mode: "new", fecha: todayStr })}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Plus size={16} /> Nuevo evento
          </button>
        )}
      </div>

      {/* Navegación mes */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-base font-semibold text-gray-900">{MESES[month]} {year}</h2>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DIAS.map(d => (
            <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400">{d}</div>
          ))}
        </div>

        {/* Celdas */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="h-20 border-b border-r border-gray-50" />;
            const evs = eventosDelDia(day);
            return (
              <div
                key={i}
                onClick={isAdmin ? () => setModal({ mode: "new", fecha: toDateStr(day) }) : undefined}
                className={`h-20 border-b border-r border-gray-100 p-1.5 flex flex-col ${isAdmin ? "cursor-pointer hover:bg-blue-50/40 transition-colors" : ""}`}
              >
                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                  isToday(day) ? "bg-blue-600 text-white" : "text-gray-700"
                }`}>
                  {day}
                </span>
                <div className="space-y-0.5 overflow-hidden">
                  {evs.slice(0, 2).map(e => (
                    <div
                      key={e.id}
                      onClick={ev => { ev.stopPropagation(); setDetalle(e); }}
                      className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 truncate leading-tight cursor-pointer hover:bg-blue-200 transition-colors"
                    >
                      {e.hora ? `${e.hora} ` : ""}{e.titulo}
                    </div>
                  ))}
                  {evs.length > 2 && (
                    <p className="text-xs text-gray-400 px-1">+{evs.length - 2} más</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Próximos eventos */}
      {proximos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <p className="px-5 py-3 text-sm font-semibold text-gray-700 border-b border-gray-100">Próximos eventos</p>
          <div className="divide-y divide-gray-100">
            {proximos.map(e => (
              <div
                key={e.id}
                onClick={() => setDetalle(e)}
                className="flex items-start gap-4 px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="text-center min-w-[40px]">
                  <p className="text-xs text-gray-400">{MESES[Number(e.fecha.slice(5, 7)) - 1].slice(0, 3)}</p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{e.fecha.slice(8, 10)}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{e.titulo}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {e.hora && <span className="text-xs text-gray-400">{e.hora}</span>}
                    {e.lugar && <span className="text-xs text-gray-400 truncate">{e.lugar}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
