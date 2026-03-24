"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from "recharts";

interface Dato { variable: string; total: number; }
interface Activo { id: number; nombre: string; variableAsignada: string | null; }
interface Props { datos: Dato[]; sinAsignar: number; totalActivos: number; activos: Activo[]; }

const COLORES = [
  "#2563eb", "#16a34a", "#dc2626", "#d97706", "#7c3aed",
  "#0891b2", "#db2777", "#65a30d", "#ea580c", "#4f46e5",
];

export default function GraficaClient({ datos, sinAsignar, totalActivos, activos }: Props) {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const totalAsignados = datos.reduce((s, d) => s + d.total, 0);

  const datosPie = datos.map((d, i) => ({ name: d.variable, value: d.total, color: COLORES[i % COLORES.length] }));

  if (datos.length === 0) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Rayado</p>
          <h1 className="text-2xl font-bold text-gray-900">Gráfica</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <p className="font-medium">Sin datos aún</p>
          <p className="text-sm mt-1">Asigna variables en <span className="text-blue-600 font-medium">Definir</span> para ver la gráfica</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Rayado</p>
        <h1 className="text-2xl font-bold text-gray-900">Gráfica</h1>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar persona para ver su asignación..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {busqueda.trim() && (() => {
          const q = busqueda.toLowerCase();
          const resultados = activos.filter((a) => a.nombre.toLowerCase().includes(q));
          if (resultados.length === 0) return <p className="text-sm text-gray-400 px-1">Sin resultados</p>;
          return (
            <div className="space-y-1">
              {resultados.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                  <p className="text-sm font-medium text-gray-900">{a.nombre}</p>
                  {a.variableAsignada ? (
                    <span className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {a.variableAsignada}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Sin asignar</span>
                  )}
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Total miembros</p>
          <p className="text-2xl font-bold text-gray-900">{totalActivos}</p>
        </div>
        <div className="bg-white rounded-2xl border border-blue-100 p-4 text-center">
          <p className="text-xs text-blue-400 mb-1">Asignados</p>
          <p className="text-2xl font-bold text-blue-600">{totalAsignados}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-xs text-gray-400 mb-1">Sin asignar</p>
          <p className="text-2xl font-bold text-gray-400">{sinAsignar}</p>
        </div>
      </div>

      {/* Gráfica de barras */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-2">Miembros por variable</p>
        <p className="text-xs text-gray-400 mb-4">Toca una barra para ver el listado</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={datos}
            margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="variable"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }}
              cursor={{ fill: "#f0f9ff" }}
            />
            <Bar
              dataKey="total"
              radius={[6, 6, 0, 0]}
              maxBarSize={64}
              style={{ cursor: "pointer" }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(data: any) => router.push(`/rayado/grafica/${encodeURIComponent(data.variable)}`)}
            >
              {datos.map((_, i) => (
                <Cell key={i} fill={COLORES[i % COLORES.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de pastel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">Distribución</p>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={datosPie}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={3}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {datosPie.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }}
            />
            <Legend iconType="circle" iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
