import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AspirantesClient from "./AspirantesClient";

export default async function AspirantesPage() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const aspirantes = await prisma.aspirante.findMany({
    select: { id: true, nombre: true, variable: true, notas: true },
    orderBy: { nombre: "asc" },
  });

  return <AspirantesClient aspirantes={aspirantes} isAdmin={isAdmin} />;
}
