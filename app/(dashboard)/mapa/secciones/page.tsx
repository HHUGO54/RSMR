import { prisma } from "@/lib/prisma";
import SeccionesClient from "./SeccionesClient";

export default async function SeccionesPage() {
  const recorridas = await prisma.seccionRecorrida.findMany();
  const map = Object.fromEntries(recorridas.map((r) => [r.seccion, r.recorrida]));
  return <SeccionesClient recorridasInit={map} />;
}
