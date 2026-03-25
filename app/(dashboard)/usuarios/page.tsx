import { prisma } from "@/lib/prisma";
import UsuariosClient from "./UsuariosClient";

export default async function UsuariosPage() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  return <UsuariosClient initialUsers={users} />;
}
