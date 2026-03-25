import bcrypt from "bcryptjs";

const hash = "$2b$10$JPZJe86abtOqWR1PTfcGIODzwZ5D.B3NiH7F.bf5ogK026BawzE5i";
bcrypt.compare("admin1234", hash).then((result) => {
  console.log("¿Contraseña correcta?", result);
});
