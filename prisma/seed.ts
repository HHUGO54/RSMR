import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

function parseCSV(content: string) {
  const lines = content.split("\n").filter((l) => l.trim());
  // Skip header
  return lines.slice(1).map((line) => {
    // Handle quoted fields with commas
    const cols: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === "," && !inQuotes) { cols.push(current.trim()); current = ""; continue; }
      current += ch;
    }
    cols.push(current.trim());

    const nombre    = cols[0]?.replace(/^ï»¿/, "").trim() ?? "";
    const fechaNac  = cols[1]?.trim() || null;
    const seccionRaw = cols[2]?.trim();
    const seccion   = seccionRaw && seccionRaw !== "#N/A" ? parseInt(seccionRaw) : null;
    const distrito  = parseInt(cols[3]?.trim() ?? "9") || 9;
    const domicilio = cols[4]?.trim() || null;
    const correo    = cols[5]?.trim() || null;
    const telefono  = cols[6]?.trim() || null;
    const indicador = cols[7]?.trim() || null;

    return { nombre, fechaNac, seccion, distrito, domicilio, correo, telefono, indicador };
  }).filter((r) => r.nombre.length > 0);
}

async function main() {
  // Crear usuario admin
  const hash = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { email: "hhugo54@me.com" },
    update: {},
    create: { email: "hhugo54@me.com", password: hash, name: "Administrador", role: "ADMIN" },
  });
  console.log("✓ Usuario admin creado: hhugo54@me.com / admin1234");

  // Importar CSV de activos
  const csvPath = path.join(process.cwd(), "prisma", "Activos_Dto_09_Seccion_2024.csv");
  if (!fs.existsSync(csvPath)) {
    console.log("⚠ CSV no encontrado en prisma/Activos_Dto_09_Seccion_2024.csv — saltando importación");
    return;
  }

  const content = fs.readFileSync(csvPath, "utf-8");
  const records = parseCSV(content);
  console.log(`Importando ${records.length} activos...`);

  await prisma.activo.deleteMany();
  await prisma.activo.createMany({ data: records });
  console.log(`✓ ${records.length} activos importados`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
