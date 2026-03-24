"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

interface SeccionDato {
  seccion: number;
  categoria: string;
  scorePAN: string;
  historial: string;
  ganador2024: string;
  votosPAN: string;
  votosMorena: string;
  panPct: string;
  morenaPct: string;
  margen: string;
  difVotos: string;
  paraVoltear: string;
  listaNominal: string;
  totalVotos: string;
  abstencion: string;
  participacion: string;
  tendPAN: string;
  nota: string;
}

interface Props {
  recorridasInit: Record<number, boolean>;
}

const CATEGORIA_BADGE: Record<string, string> = {
  "BASTIÓN SÓLIDO":       "bg-blue-100 text-blue-800",
  "BASTIÓN":              "bg-sky-100 text-sky-800",
  "COMPETITIVA CRÍTICA":  "bg-gray-100 text-gray-700 border border-gray-300",
  "COMPETITIVA":          "bg-pink-100 text-pink-800",
  "VENTAJA AJUSTADA":     "bg-yellow-100 text-yellow-800",
  "TERRITORIO DISPUTADO": "bg-red-100 text-red-700",
  "TERRITORIO MORENA":    "bg-red-950 text-white",
};

function categoriaClass(cat: string) {
  const upper = cat?.toUpperCase() ?? "";
  if (upper.includes("BASTIÓN SÓLIDO"))       return CATEGORIA_BADGE["BASTIÓN SÓLIDO"];
  if (upper.includes("BASTIÓN"))              return CATEGORIA_BADGE["BASTIÓN"];
  if (upper.includes("COMPETITIVA CRÍTICA"))  return CATEGORIA_BADGE["COMPETITIVA CRÍTICA"];
  if (upper.includes("COMPETITIVA"))          return CATEGORIA_BADGE["COMPETITIVA"];
  if (upper.includes("VENTAJA AJUSTADA"))     return CATEGORIA_BADGE["VENTAJA AJUSTADA"];
  if (upper.includes("TERRITORIO DISPUTADO")) return CATEGORIA_BADGE["TERRITORIO DISPUTADO"];
  if (upper.includes("TERRITORIO MORENA"))    return CATEGORIA_BADGE["TERRITORIO MORENA"];
  return "bg-gray-100 text-gray-700";
}

export default function SeccionesClient({ recorridasInit }: Props) {
  const [secciones, setSecciones] = useState<SeccionDato[]>([]);
  const [recorridas, setRecorridas] = useState<Record<number, boolean>>(recorridasInit);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<"todas" | "si" | "no">("todas");
  const [loaded, setLoaded] = useState(false);

  // Cargar datos del JSON al montar
  useState(() => {
    fetch("/rentabilidad_secciones.json")
      .then((r) => r.json())
      .then((data: SeccionDato[]) => {
        setSecciones(data);
        setLoaded(true);
      });
  });

  async function toggleRecorrida(seccion: number, valor: boolean) {
    setRecorridas((prev) => ({ ...prev, [seccion]: valor }));
    await fetch("/api/secciones-recorridas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seccion, recorrida: valor }),
    });
  }

  const filtradas = useMemo(() => {
    let result = secciones;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      result = result.filter(
        (s) => String(s.seccion).includes(q) || s.categoria.toLowerCase().includes(q)
      );
    }
    if (filtro === "si")  result = result.filter((s) => recorridas[s.seccion] === true);
    if (filtro === "no")  result = result.filter((s) => !recorridas[s.seccion]);
    return result;
  }, [secciones, busqueda, filtro, recorridas]);

  const totalSi = secciones.filter((s) => recorridas[s.seccion] === true).length;
  const totalNo = secciones.length - totalSi;

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Secciones</h1>
        <p className="text-sm text-gray-500 mt-0.5">Distrito 09 · {secciones.length} secciones</p>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{secciones.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-green-100 p-4 text-center">
          <p className="text-xs text-green-500 mb-1">Recorridas</p>
          <p className="text-2xl font-bold text-green-600">{totalSi}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-gray-400">{totalNo}</p>
        </div>
      </div>

      {/* Buscador + filtro */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar sección o categoría..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as "todas" | "si" | "no")}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="todas">Todas</option>
          <option value="si">Recorridas</option>
          <option value="no">Pendientes</option>
        </select>
      </div>

      {/* Tabla */}
      {!loaded ? (
        <div className="py-12 text-center text-sm text-gray-400">Cargando...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Sección</th>
                  <th className="px-4 py-3 text-left">Categoría</th>
                  <th className="px-4 py-3 text-center">Score PAN</th>
                  <th className="px-4 py-3 text-center">Ganador 2024</th>
                  <th className="px-4 py-3 text-center">PAN %</th>
                  <th className="px-4 py-3 text-center">Margen (pp)</th>
                  <th className="px-4 py-3 text-center">Lista nominal</th>
                  <th className="px-4 py-3 text-center">Recorrida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtradas.map((s) => (
                  <tr key={s.seccion} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{s.seccion}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${categoriaClass(s.categoria)}`}>
                        {s.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{s.scorePAN}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                        s.ganador2024 === "PAN" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-700"
                      }`}>
                        {s.ganador2024}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{s.panPct}</td>
                    <td className="px-4 py-3 text-center font-medium text-gray-700">{s.margen}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{s.listaNominal}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => toggleRecorrida(s.seccion, true)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            recorridas[s.seccion] === true
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700"
                          }`}
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => toggleRecorrida(s.seccion, false)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            recorridas[s.seccion] === false && recorridas[s.seccion] !== undefined
                              ? "bg-gray-500 text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtradas.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-400">Sin resultados</p>
          )}
        </div>
      )}
    </div>
  );
}
