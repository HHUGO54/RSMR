import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  const r = await client.execute("SELECT email, name, password FROM User");
  console.log(r.rows);
  client.close();
}

main().catch(console.error);
