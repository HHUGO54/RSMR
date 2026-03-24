-- CreateTable
CREATE TABLE "Aspirante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fechaNac" TEXT,
    "seccion" INTEGER,
    "distrito" INTEGER NOT NULL DEFAULT 9,
    "domicilio" TEXT,
    "correo" TEXT,
    "telefono" TEXT,
    "variable" TEXT,
    "notas" TEXT
);
