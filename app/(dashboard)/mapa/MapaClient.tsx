"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, FileDown } from "lucide-react";

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

// Colores Leaflet para el modo categoría
const CAT_FILL: Record<string, { fill: string; border: string }> = {
  "BASTIÓN SÓLIDO":       { fill: "#1d4ed8", border: "#1e3a8a" },
  "BASTIÓN":              { fill: "#0ea5e9", border: "#075985" },
  "COMPETITIVA CRÍTICA":  { fill: "#ffffff", border: "#9ca3af" },
  "COMPETITIVA":          { fill: "#f472b6", border: "#be185d" },
  "VENTAJA AJUSTADA":     { fill: "#fbbf24", border: "#92400e" },
  "TERRITORIO DISPUTADO": { fill: "#dc2626", border: "#7f1d1d" },
  "TERRITORIO MORENA":    { fill: "#7f1d1d", border: "#450a0a" },
};

// Colores Tailwind para badges
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

function catFill(cat: string): { fill: string; border: string } {
  const upper = cat?.toUpperCase() ?? "";
  if (upper.includes("BASTIÓN SÓLIDO"))       return CAT_FILL["BASTIÓN SÓLIDO"];
  if (upper.includes("BASTIÓN"))              return CAT_FILL["BASTIÓN"];
  if (upper.includes("COMPETITIVA CRÍTICA"))  return CAT_FILL["COMPETITIVA CRÍTICA"];
  if (upper.includes("COMPETITIVA"))          return CAT_FILL["COMPETITIVA"];
  if (upper.includes("VENTAJA AJUSTADA"))     return CAT_FILL["VENTAJA AJUSTADA"];
  if (upper.includes("TERRITORIO DISPUTADO")) return CAT_FILL["TERRITORIO DISPUTADO"];
  if (upper.includes("TERRITORIO MORENA"))    return CAT_FILL["TERRITORIO MORENA"];
  return { fill: "#93c5fd", border: "#2563eb" };
}

const LEYENDA = [
  { label: "Bastión Sólido",       ...CAT_FILL["BASTIÓN SÓLIDO"] },
  { label: "Bastión",              ...CAT_FILL["BASTIÓN"] },
  { label: "Competitiva Crítica",  ...CAT_FILL["COMPETITIVA CRÍTICA"] },
  { label: "Competitiva",          ...CAT_FILL["COMPETITIVA"] },
  { label: "Ventaja Ajustada",     ...CAT_FILL["VENTAJA AJUSTADA"] },
  { label: "Territorio Disputado", ...CAT_FILL["TERRITORIO DISPUTADO"] },
  { label: "Territorio Morena",    ...CAT_FILL["TERRITORIO MORENA"] },
];

export default function MapaClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").GeoJSON | null>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const rentabilidadRef = useRef<SeccionDato[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [noEncontrada, setNoEncontrada] = useState(false);
  const [rentabilidad, setRentabilidad] = useState<SeccionDato[]>([]);
  const [seccionNum, setSeccionNum] = useState<number | null>(null);
  const [modoCat, setModoCat] = useState(false);
  const [modoRec, setModoRec] = useState(false);
  const recorridasRef = useRef<Set<number>>(new Set());

  const dato = seccionNum !== null
    ? (rentabilidad.find((d) => d.seccion === seccionNum) ?? null)
    : null;

  // Scroll al panel cuando se selecciona sección
  useEffect(() => {
    if (seccionNum !== null) {
      setTimeout(() => {
        infoPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [seccionNum]);

  // Cargar datos de rentabilidad
  useEffect(() => {
    fetch("/rentabilidad_secciones.json")
      .then((r) => r.json())
      .then((data: SeccionDato[]) => {
        setRentabilidad(data);
        rentabilidadRef.current = data;
      });
  }, []);

  // Cargar secciones recorridas
  useEffect(() => {
    fetch("/api/secciones-recorridas")
      .then((r) => r.json())
      .then((rows: { seccion: number; recorrida: boolean }[]) => {
        recorridasRef.current = new Set(rows.filter((r) => r.recorrida).map((r) => r.seccion));
      });
  }, []);

  // Aplicar estilos según el modo activo
  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.eachLayer((lyr) => {
      const path = lyr as L.Path & { feature?: GeoJSON.Feature };
      const seccion = path.feature?.properties?.SECCION as number | undefined;
      if (!seccion) return;
      if (modoRec) {
        const rec = recorridasRef.current.has(seccion);
        path.setStyle(rec
          ? { fillColor: "#16a34a", fillOpacity: 0.7, color: "#14532d", weight: 1.5, opacity: 1 }
          : { fillColor: "#e5e7eb", fillOpacity: 0.5, color: "#9ca3af", weight: 1, opacity: 0.6 }
        );
      } else if (modoCat) {
        const cat = rentabilidadRef.current.find((d) => d.seccion === seccion)?.categoria ?? "";
        const { fill, border } = catFill(cat);
        path.setStyle({ fillColor: fill, fillOpacity: 0.65, color: border, weight: 1.5, opacity: 1 });
      } else {
        path.setStyle({ fillColor: "#93c5fd", fillOpacity: 0.25, color: "#2563eb", weight: 1.5, opacity: 0.8 });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modoCat, modoRec]);

  // Inicializar mapa
  useEffect(() => {
    if (!containerRef.current) return;

    async function init() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      const proj4 = (await import("proj4")).default;

      if (!containerRef.current) return;
      const el = containerRef.current as HTMLDivElement & { _leaflet_id?: number };
      if (el._leaflet_id) return;

      const utm11n = "+proj=utm +zone=11 +datum=WGS84 +units=m +no_defs";
      const wgs84  = "+proj=longlat +datum=WGS84 +no_defs";

      function convertGeometry(geometry: GeoJSON.Geometry): GeoJSON.Geometry {
        if (geometry.type === "Polygon") {
          return {
            type: "Polygon",
            coordinates: geometry.coordinates.map((ring) =>
              ring.map(([x, y]) => { const [lng, lat] = proj4(utm11n, wgs84, [x, y]); return [lng, lat]; })
            ),
          };
        }
        if (geometry.type === "MultiPolygon") {
          return {
            type: "MultiPolygon",
            coordinates: geometry.coordinates.map((polygon) =>
              polygon.map((ring) =>
                ring.map(([x, y]) => { const [lng, lat] = proj4(utm11n, wgs84, [x, y]); return [lng, lat]; })
              )
            ),
          };
        }
        return geometry;
      }

      const res = await fetch("/Secciones_Dto_09.geojson");
      const raw = await res.json() as GeoJSON.FeatureCollection;

      const converted: GeoJSON.FeatureCollection = {
        ...raw,
        features: raw.features.map((f) => ({
          ...f,
          geometry: convertGeometry(f.geometry),
        })),
      };

      const map = L.map(containerRef.current!).setView([32.52, -117.03], 11);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      const style = document.createElement("style");
      style.textContent = ".leaflet-interactive { outline: none !important; }";
      document.head.appendChild(style);

      const layer = L.geoJSON(converted as GeoJSON.GeoJsonObject, {
        style: {
          color: "#2563eb",
          weight: 1.5,
          opacity: 0.8,
          fillColor: "#93c5fd",
          fillOpacity: 0.25,
        },
        onEachFeature(feature, lyr) {
          const seccion = feature.properties?.SECCION as number | undefined;
          if (seccion) {
            lyr.bindTooltip(`Sección ${seccion}`, { permanent: false, direction: "center" });
            lyr.on("mouseover", () => (lyr as L.Path).setStyle({ fillOpacity: 0.8, weight: 2.5 }));
            lyr.on("mouseout",  () => layer.resetStyle(lyr as L.Path));
            lyr.on("click", () => {
              layer.resetStyle();
              (lyr as L.Path).setStyle({ fillColor: "#fbbf24", fillOpacity: 0.9, color: "#92400e", weight: 3 });
              setBusqueda(String(seccion));
              setNoEncontrada(false);
              setSeccionNum(seccion);
            });
          }
        },
      }).addTo(map);

      layerRef.current = layer;

      const bounds = layer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [16, 16] });
    }

    init();

    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  function buscarSeccion() {
    const num = parseInt(busqueda.trim());
    if (!num || !layerRef.current || !mapRef.current) return;

    let encontrado = false;
    layerRef.current.eachLayer((lyr) => {
      const path = lyr as L.Path & { feature?: GeoJSON.Feature };
      if (path.feature?.properties?.SECCION === num) {
        encontrado = true;
        layerRef.current!.resetStyle();
        path.setStyle({ fillColor: "#fbbf24", fillOpacity: 0.9, color: "#92400e", weight: 3 });
        const bounds = (lyr as L.Polygon).getBounds?.();
        if (bounds?.isValid()) mapRef.current!.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
        setSeccionNum(num);
      }
    });

    setNoEncontrada(!encontrado);
  }

  function limpiar() {
    setBusqueda("");
    setNoEncontrada(false);
    setSeccionNum(null);
    layerRef.current?.resetStyle();
  }

  async function buildMapCanvas(): Promise<string | null> {
    if (!layerRef.current || seccionNum === null) return null;

    // ── Web Mercator helpers ──────────────────────────────────────────
    const TILE = 256;
    const lngToW = (lng: number, z: number) =>
      ((lng + 180) / 360) * TILE * Math.pow(2, z);
    const latToW = (lat: number, z: number) => {
      const sin = Math.sin((lat * Math.PI) / 180);
      return (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * TILE * Math.pow(2, z);
    };

    // ── Recolectar polígonos ──────────────────────────────────────────
    const features: Array<{ coords: number[][][]; selected: boolean }> = [];
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;

    layerRef.current.eachLayer((lyr) => {
      const path = lyr as L.Path & { feature?: GeoJSON.Feature };
      const geom = path.feature?.geometry;
      const sec  = path.feature?.properties?.SECCION as number | undefined;
      if (!geom) return;
      let coords: number[][][] = [];
      if (geom.type === "Polygon")           coords = geom.coordinates as number[][][];
      else if (geom.type === "MultiPolygon") coords = (geom.coordinates as number[][][][]).flat();
      features.push({ coords, selected: sec === seccionNum });
    });

    const sel = features.find((f) => f.selected);
    if (!sel) return null;

    // Bounds de la sección (sin padding — solo para calcular zoom)
    sel.coords.forEach((ring) =>
      ring.forEach(([lng, lat]) => {
        if (lng < minLng) minLng = lng; if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
      })
    );

    // ── Zoom: sección ocupa ~45 % del canvas (3×3 tiles = 768 px) ────
    const avgLat  = (minLat + maxLat) / 2;
    const latScale = Math.cos((avgLat * Math.PI) / 180);
    const effectiveLng = Math.max(maxLng - minLng, (maxLat - minLat) / latScale);
    const zoom = Math.max(12, Math.min(16,
      Math.round(Math.log2((3 * TILE * 0.45 * 360) / (effectiveLng * TILE)))
    ));

    // ── Cuadrícula 3×3 centrada en el centroide de la sección ────────
    const cLng = (minLng + maxLng) / 2;
    const cLat = (minLat + maxLat) / 2;
    const cTx  = Math.floor(lngToW(cLng, zoom) / TILE);
    const cTy  = Math.floor(latToW(cLat, zoom) / TILE);

    const txMin = cTx - 1;
    const txMax = cTx + 1;
    const tyMin = cTy - 1;
    const tyMax = cTy + 1;

    const wxMin = txMin * TILE;
    const wyMin = tyMin * TILE;

    const CW = (txMax - txMin + 1) * TILE;
    const CH = (tyMax - tyMin + 1) * TILE;

    const canvas = document.createElement("canvas");
    canvas.width = CW; canvas.height = CH;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f0f4f8";
    ctx.fillRect(0, 0, CW, CH);

    // ── Cargar tiles directo desde Carto (CORS nativo, sin proxy) ────
    const loadTile = (z: number, x: number, y: number): Promise<HTMLImageElement | null> =>
      new Promise((resolve) => {
        const sub = ["a", "b", "c", "d"][x % 4];
        const img = new Image();
        img.crossOrigin = "anonymous";
        const timer = setTimeout(() => resolve(null), 6000);
        img.onload  = () => { clearTimeout(timer); resolve(img); };
        img.onerror = () => { clearTimeout(timer); resolve(null); };
        img.src = `https://${sub}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}.png`;
      });

    // Cargar en paralelo por fila (balance entre velocidad y estabilidad)
    for (let ty = tyMin; ty <= tyMax; ty++) {
      await Promise.all(
        Array.from({ length: txMax - txMin + 1 }, (_, i) => txMin + i).map(async (tx) => {
          const img = await loadTile(zoom, tx, ty);
          if (img) ctx.drawImage(img, (tx - txMin) * TILE, (ty - tyMin) * TILE, TILE, TILE);
        })
      );
    }

    // ── Proyección de polígonos ───────────────────────────────────────
    const toXY = (lng: number, lat: number) => ({
      x: lngToW(lng, zoom) - wxMin,
      y: latToW(lat, zoom) - wyMin,
    });

    const drawPoly = (coords: number[][][], fill: string, stroke: string, lw: number) => {
      for (const ring of coords) {
        ctx.beginPath();
        const s = toXY(ring[0][0], ring[0][1]);
        ctx.moveTo(s.x, s.y);
        for (let i = 1; i < ring.length; i++) {
          const p = toXY(ring[i][0], ring[i][1]);
          ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fillStyle = fill; ctx.fill();
        ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();
      }
    };

    // Vecinos: borde fino, sin relleno
    features.forEach((f) => {
      if (!f.selected) drawPoly(f.coords, "rgba(0,0,0,0)", "#3b82f6", 1.2);
    });
    // Seleccionada: relleno semitransparente, borde marcado
    drawPoly(sel.coords, "rgba(251,191,36,0.28)", "#b45309", 2.5);

    // Atribución (requerida por Carto + OSM)
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "bottom";
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillText("© OpenStreetMap contributors © CARTO", CW - 4, CH - 3);

    return canvas.toDataURL("image/jpeg", 0.92);
  }

  async function generarPDF() {
    if (!dato) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });

    const mapImgData = await buildMapCanvas();

    const BLUE    = [30, 64, 175]  as [number, number, number];
    const GRAY    = [75, 85, 99]   as [number, number, number];
    const BLACK   = [17, 24, 39]   as [number, number, number];
    const LIGHTBG = [243, 244, 246] as [number, number, number];
    const AMBER   = [251, 191, 36] as [number, number, number];
    const W = 215.9; // letter width mm

    // Header band
    doc.setFillColor(...BLUE);
    doc.rect(0, 0, W, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`Sección Electoral ${dato.seccion}`, 14, 19);

    // Categoria badge area
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const catText = dato.categoria.toUpperCase();
    const catW = doc.getTextWidth(catText) + 8;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(W - catW - 14, 10, catW, 10, 2, 2, "F");
    doc.setTextColor(...BLUE);
    doc.text(catText, W - catW - 10, 17);

    // Subtitle
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("Distrito 09 — RSBMR", W - 14, 24, { align: "right" });

    // Canvas siempre 768×768 (cuadrícula 3×3) → ratio 1:1
    const MAP_W = W - 28;
    const MAP_H = MAP_W; // cuadrado
    let y = 31;

    if (mapImgData) {
      doc.addImage(mapImgData, "JPEG", 14, y, MAP_W, MAP_H, undefined, "FAST");
      doc.setDrawColor(209, 213, 219);
      doc.setLineWidth(0.3);
      doc.rect(14, y, MAP_W, MAP_H);
      y += MAP_H + 4;
    }

    // ── Tabla compacta (~¼ hoja) ─────────────────────────────────────
    // 4 filas × 4 cols, sin encabezados de sección
    const COL = 4;
    const colW = MAP_W / COL;
    const ROW_H = 10; // mm por fila
    const LABEL_SZ = 6.5;
    const VAL_SZ   = 9;

    const rows: { label: string; value: string }[][] = [
      [
        { label: "Ganador 2024",    value: dato.ganador2024 },
        { label: "Votos PAN",       value: dato.votosPAN },
        { label: "Votos MORENA",    value: dato.votosMorena },
        { label: "Total votos",     value: dato.totalVotos },
      ],
      [
        { label: "PAN %",           value: dato.panPct },
        { label: "MORENA %",        value: dato.morenaPct },
        { label: "Margen (pp)",     value: dato.margen },
        { label: "Dif. Votos",      value: dato.difVotos },
      ],
      [
        { label: "Score PAN",       value: dato.scorePAN },
        { label: "Tend. PAN (pp)",  value: dato.tendPAN },
        { label: "Historial",       value: dato.historial },
        { label: "Para voltear",    value: dato.paraVoltear },
      ],
      [
        { label: "Lista nominal",   value: dato.listaNominal },
        { label: "Participación %", value: dato.participacion },
        { label: "Abstención",      value: dato.abstencion },
        { label: "Categoría",       value: dato.categoria },
      ],
    ];

    rows.forEach((row, ri) => {
      // Fondo alterno
      if (ri % 2 === 0) {
        doc.setFillColor(...LIGHTBG);
        doc.rect(14, y, MAP_W, ROW_H, "F");
      }
      row.forEach(({ label, value }, ci) => {
        const x = 14 + ci * colW + 2;
        doc.setTextColor(...GRAY);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(LABEL_SZ);
        doc.text(label, x, y + 4);
        doc.setTextColor(...BLACK);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(VAL_SZ);
        doc.text(value ?? "—", x, y + 9);
      });
      y += ROW_H;
    });

    y += 3;

    // Nota estratégica compacta
    if (dato.nota) {
      doc.setFillColor(255, 251, 235);
      const noteLines = doc.splitTextToSize(dato.nota, MAP_W - 16) as string[];
      const noteH = noteLines.length * 4.5 + 10;
      doc.rect(14, y, MAP_W, noteH, "F");
      doc.setDrawColor(...AMBER);
      doc.setLineWidth(0.8);
      doc.line(14, y, 14, y + noteH);
      doc.setLineWidth(0.2);
      doc.setTextColor(146, 64, 14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text("NOTA ESTRATÉGICA", 20, y + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(120, 53, 15);
      doc.text(noteLines, 20, y + 10);
      y += noteH + 3;
    }

    // Footer
    const today = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
    doc.setDrawColor(...LIGHTBG);
    doc.setLineWidth(0.4);
    doc.line(14, y + 2, W - 14, y + 2);
    doc.setTextColor(...GRAY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`Generado el ${today}`, 14, y + 8);
    doc.text("RSBMR — Distrito 09 — Uso interno", W - 14, y + 8, { align: "right" });

    doc.save(`seccion_${dato.seccion}.pdf`);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Buscador + toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setNoEncontrada(false); }}
            onKeyDown={(e) => e.key === "Enter" && buscarSeccion()}
            placeholder="Número de sección..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={buscarSeccion}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Buscar
        </button>
        <button
          onClick={() => { setModoCat((v) => !v); setModoRec(false); }}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors border ${
            modoCat
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          Categoría
        </button>
        <button
          onClick={() => { setModoRec((v) => !v); setModoCat(false); }}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors border ${
            modoRec
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          Recorridas
        </button>
        {busqueda && (
          <button
            onClick={limpiar}
            className="rounded-xl border border-gray-200 p-2.5 text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {noEncontrada && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
          Sección no encontrada
        </p>
      )}

      {/* Mapa */}
      <div
        ref={containerRef}
        className="rounded-2xl border border-gray-200 overflow-hidden"
        style={{ height: "520px" }}
      />

      {/* Leyenda — modo recorridas */}
      {modoRec && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Leyenda</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: "#16a34a" }} />
              <span className="text-xs text-gray-700">Recorrida</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: "#e5e7eb" }} />
              <span className="text-xs text-gray-700">Pendiente</span>
            </div>
          </div>
        </div>
      )}

      {/* Leyenda — solo en modo categoría */}
      {modoCat && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Leyenda</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LEYENDA.map(({ label, fill }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: fill }}
                />
                <span className="text-xs text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de sección seleccionada */}
      {seccionNum !== null && (
        <div ref={infoPanelRef} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {dato ? (
            <>
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Sección</p>
                  <p className="text-xl font-bold text-gray-900">{dato.seccion}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${categoriaClass(dato.categoria)}`}>
                  {dato.categoria}
                </span>
                <button
                  onClick={generarPDF}
                  className="ml-auto flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  <FileDown size={14} /> PDF
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 divide-x divide-y divide-gray-100">
                {[
                  { label: "Score PAN",          value: dato.scorePAN },
                  { label: "Historial 2019–24",  value: dato.historial },
                  { label: "Ganador 2024",        value: dato.ganador2024 },
                  { label: "Votos PAN",           value: dato.votosPAN },
                  { label: "Votos MORENA",        value: dato.votosMorena },
                  { label: "PAN %",               value: dato.panPct },
                  { label: "MORENA %",            value: dato.morenaPct },
                  { label: "Margen (pp)",         value: dato.margen },
                  { label: "Dif. Votos",          value: dato.difVotos },
                  { label: "Votos para voltear",  value: dato.paraVoltear },
                  { label: "Lista nominal",       value: dato.listaNominal },
                  { label: "Total votos",         value: dato.totalVotos },
                  { label: "Abstención",          value: dato.abstencion },
                  { label: "Partic. %",           value: dato.participacion },
                  { label: "Tend. PAN (pp)",      value: dato.tendPAN },
                ].map(({ label, value }) => (
                  <div key={label} className="px-4 py-3">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-900">{value}</p>
                  </div>
                ))}

                {dato.nota && (
                  <div className="col-span-2 sm:col-span-3 md:col-span-4 px-4 py-3 bg-amber-50">
                    <p className="text-xs text-amber-700 font-semibold mb-0.5">Nota estratégica</p>
                    <p className="text-sm text-amber-800">{dato.nota}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="px-5 py-4 text-sm text-gray-400">
              Sección {seccionNum} — sin datos de rentabilidad
            </div>
          )}
        </div>
      )}
    </div>
  );
}
