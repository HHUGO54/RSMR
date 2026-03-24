import { prisma } from "@/lib/prisma";
import { Users, CheckSquare, Truck, Map, Handshake } from "lucide-react";

export default async function DashboardPage() {
  const [
    totalActivos,
    activosConRayado,
    activosConMovilizacion,
    totalAspirantes,
    totalMovilizadores,
    totalEquipo,
    tareasTotal,
    tareasCompletas,
    seccionesRecorridas,
    totalSandra,
  ] = await Promise.all([
    prisma.activo.count(),
    prisma.activo.count({ where: { variableAsignada: { not: null } } }),
    prisma.activo.count({ where: { variableAsignada: "SANDRA", movilizacionAsignada: { not: null } } }),
    prisma.aspirante.count(),
    prisma.movilizador.count(),
    prisma.equipoCompromiso.count(),
    prisma.tarea.count(),
    prisma.tarea.count({ where: { completada: true } }),
    prisma.seccionRecorrida.count({ where: { recorrida: true } }),
    prisma.activo.count({ where: { variableAsignada: "SANDRA" } }),
  ]);

  const TOTAL_SECCIONES = 152;

  const pctRayado = totalActivos > 0 ? Math.round((activosConRayado / totalActivos) * 100) : 0;
  const pctMovilizacion = totalSandra > 0 ? Math.round((activosConMovilizacion / totalSandra) * 100) : 0;
  const pctTareas = tareasTotal > 0 ? Math.round((tareasCompletas / tareasTotal) * 100) : 0;
  const pctSecciones = TOTAL_SECCIONES > 0 ? Math.round((seccionesRecorridas / TOTAL_SECCIONES) * 100) : 0;

  const secciones = [
    {
      label: "Activos",
      icon: Users,
      color: "blue",
      cards: [
        { title: "Total miembros", value: totalActivos, sub: null },
        { title: "Con rayado asignado", value: activosConRayado, sub: `${pctRayado}% del total`, pct: pctRayado },
        { title: "Con movilización asignada", value: activosConMovilizacion, sub: `${pctMovilizacion}% del total`, pct: pctMovilizacion },
      ],
    },
    {
      label: "Rayado",
      icon: CheckSquare,
      color: "purple",
      cards: [
        { title: "Aspirantes (variables)", value: totalAspirantes, sub: null },
        { title: "Asignados", value: activosConRayado, sub: `${pctRayado}% de activos`, pct: pctRayado },
        { title: "Sin asignar", value: totalActivos - activosConRayado, sub: null },
      ],
    },
    {
      label: "Movilización",
      icon: Truck,
      color: "orange",
      cards: [
        { title: "Movilizadores", value: totalMovilizadores, sub: null },
        { title: "Asignados", value: activosConMovilizacion, sub: `${pctMovilizacion}% de Sandra`, pct: pctMovilizacion },
        { title: "Sin asignar", value: totalSandra - activosConMovilizacion, sub: `de ${totalSandra} en Sandra` },
      ],
    },
    {
      label: "Mapa · Secciones",
      icon: Map,
      color: "green",
      cards: [
        { title: "Secciones recorridas", value: seccionesRecorridas, sub: `de ${TOTAL_SECCIONES} registradas`, pct: pctSecciones },
        { title: "Pendientes", value: TOTAL_SECCIONES - seccionesRecorridas, sub: null },
      ],
    },
    {
      label: "Compromisos",
      icon: Handshake,
      color: "pink",
      cards: [
        { title: "Equipo (variables)", value: totalEquipo, sub: null },
        { title: "Tareas completas", value: tareasCompletas, sub: `${pctTareas}% del total`, pct: pctTareas },
        { title: "Tareas pendientes", value: tareasTotal - tareasCompletas, sub: `de ${tareasTotal} en total` },
      ],
    },
  ];

  const colorMap: Record<string, { bg: string; icon: string; bar: string; border: string }> = {
    blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   bar: "bg-blue-500",   border: "border-blue-100" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", bar: "bg-purple-500", border: "border-purple-100" },
    orange: { bg: "bg-orange-50", icon: "text-orange-600", bar: "bg-orange-500", border: "border-orange-100" },
    green:  { bg: "bg-green-50",  icon: "text-green-600",  bar: "bg-green-500",  border: "border-green-100" },
    pink:   { bg: "bg-pink-50",   icon: "text-pink-600",   bar: "bg-pink-500",   border: "border-pink-100" },
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen general · Distrito 09</p>
      </div>

      {secciones.map(({ label, icon: Icon, color, cards }) => {
        const c = colorMap[color];
        return (
          <div key={label}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.bg}`}>
                <Icon size={15} className={c.icon} />
              </div>
              <p className="text-sm font-semibold text-gray-700">{label}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {cards.map(({ title, value, sub, pct }) => (
                <div
                  key={title}
                  className={`bg-white rounded-2xl border ${pct !== undefined ? c.border : "border-gray-200"} p-4 flex flex-col gap-2`}
                >
                  <p className="text-xs text-gray-400 leading-snug">{title}</p>
                  <p className={`text-2xl font-bold ${pct !== undefined ? c.icon : "text-gray-900"}`}>
                    {value.toLocaleString()}
                  </p>
                  {pct !== undefined && (
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${c.bar} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                  {sub && <p className="text-xs text-gray-400">{sub}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
