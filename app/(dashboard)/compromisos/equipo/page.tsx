import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EquipoClient from "./EquipoClient";

export default async function EquipoPage() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const equipo = await prisma.equipoCompromiso.findMany({ orderBy: { id: "asc" } });
  return <EquipoClient equipo={equipo} isAdmin={isAdmin} />;
}
