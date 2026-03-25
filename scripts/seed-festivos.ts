import "dotenv/config";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  console.error("❌ DATABASE_URL no definida");
  process.exit(1);
}

const client = createClient({ url, authToken });

const festivos = [
  // 2026
  { titulo: "Año Nuevo",                     fecha: "2026-01-01", descripcion: "Día festivo oficial" },
  { titulo: "Día de Reyes",                  fecha: "2026-01-06", descripcion: "Asueto común" },
  { titulo: "Día de la Constitución",        fecha: "2026-02-02", descripcion: "Día festivo oficial" },
  { titulo: "Día del Amor y la Amistad",     fecha: "2026-02-14", descripcion: "Asueto común" },
  { titulo: "Natalicio de Benito Juárez",    fecha: "2026-03-16", descripcion: "Día festivo oficial" },
  { titulo: "Día de San José",               fecha: "2026-03-19", descripcion: "Asueto común" },
  { titulo: "Jueves Santo",                  fecha: "2026-04-02", descripcion: "Asueto común" },
  { titulo: "Viernes Santo",                 fecha: "2026-04-03", descripcion: "Asueto común" },
  { titulo: "Domingo de Resurrección",       fecha: "2026-04-05", descripcion: "Asueto común" },
  { titulo: "Día del Niño",                  fecha: "2026-04-30", descripcion: "Asueto escolar" },
  { titulo: "Día del Trabajo",               fecha: "2026-05-01", descripcion: "Día festivo oficial" },
  { titulo: "Batalla de Puebla",             fecha: "2026-05-05", descripcion: "Asueto común" },
  { titulo: "Día de las Madres",             fecha: "2026-05-10", descripcion: "Asueto común" },
  { titulo: "Día de la Independencia",       fecha: "2026-09-16", descripcion: "Día festivo oficial" },
  { titulo: "Día de Todos los Santos",       fecha: "2026-11-01", descripcion: "Asueto común" },
  { titulo: "Día de Muertos",                fecha: "2026-11-02", descripcion: "Asueto común" },
  { titulo: "Día de la Revolución",          fecha: "2026-11-16", descripcion: "Día festivo oficial" },
  { titulo: "Día de la Virgen de Guadalupe", fecha: "2026-12-12", descripcion: "Asueto común" },
  { titulo: "Nochebuena",                    fecha: "2026-12-24", descripcion: "Asueto común" },
  { titulo: "Navidad",                       fecha: "2026-12-25", descripcion: "Día festivo oficial" },
  { titulo: "Año Nuevo (víspera)",           fecha: "2026-12-31", descripcion: "Asueto común" },
  // 2027
  { titulo: "Año Nuevo",                     fecha: "2027-01-01", descripcion: "Día festivo oficial" },
  { titulo: "Día de Reyes",                  fecha: "2027-01-06", descripcion: "Asueto común" },
  { titulo: "Día de la Constitución",        fecha: "2027-02-01", descripcion: "Día festivo oficial" },
  { titulo: "Día del Amor y la Amistad",     fecha: "2027-02-14", descripcion: "Asueto común" },
  { titulo: "Natalicio de Benito Juárez",    fecha: "2027-03-15", descripcion: "Día festivo oficial" },
  { titulo: "Día de San José",               fecha: "2027-03-19", descripcion: "Asueto común" },
  { titulo: "Jueves Santo",                  fecha: "2027-03-25", descripcion: "Asueto común" },
  { titulo: "Viernes Santo",                 fecha: "2027-03-26", descripcion: "Asueto común" },
  { titulo: "Domingo de Resurrección",       fecha: "2027-03-28", descripcion: "Asueto común" },
  { titulo: "Día del Niño",                  fecha: "2027-04-30", descripcion: "Asueto escolar" },
  { titulo: "Día del Trabajo",               fecha: "2027-05-01", descripcion: "Día festivo oficial" },
  { titulo: "Batalla de Puebla",             fecha: "2027-05-05", descripcion: "Asueto común" },
  { titulo: "Día de las Madres",             fecha: "2027-05-10", descripcion: "Asueto común" },
  { titulo: "Día de la Independencia",       fecha: "2027-09-16", descripcion: "Día festivo oficial" },
  { titulo: "Día de Todos los Santos",       fecha: "2027-11-01", descripcion: "Asueto común" },
  { titulo: "Día de Muertos",                fecha: "2027-11-02", descripcion: "Asueto común" },
  { titulo: "Día de la Revolución",          fecha: "2027-11-15", descripcion: "Día festivo oficial" },
  { titulo: "Día de la Virgen de Guadalupe", fecha: "2027-12-12", descripcion: "Asueto común" },
  { titulo: "Nochebuena",                    fecha: "2027-12-24", descripcion: "Asueto común" },
  { titulo: "Navidad",                       fecha: "2027-12-25", descripcion: "Día festivo oficial" },
  { titulo: "Año Nuevo (víspera)",           fecha: "2027-12-31", descripcion: "Asueto común" },
];

async function main() {
  let insertados = 0;
  for (const f of festivos) {
    await client.execute({
      sql: `INSERT INTO Evento (titulo, fecha, descripcion) VALUES (?, ?, ?)`,
      args: [f.titulo, f.fecha, f.descripcion],
    });
    console.log(`✅ ${f.fecha} — ${f.titulo}`);
    insertados++;
  }
  console.log(`\n✓ ${insertados} días festivos insertados.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
