"use client";
import dynamic from "next/dynamic";

const MapaClient = dynamic(() => import("./MapaClient"), { ssr: false });

export default function MapaPage() {
  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mapa</h1>
        <p className="text-sm text-gray-500 mt-0.5">Secciones · Distrito 09</p>
      </div>
      <MapaClient />
    </div>
  );
}
