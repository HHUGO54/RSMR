-- CreateTable
CREATE TABLE "Rayado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fechaNac" TEXT,
    "seccion" INTEGER,
    "distrito" INTEGER NOT NULL DEFAULT 9,
    "domicilio" TEXT,
    "correo" TEXT,
    "telefono" TEXT,
    "fecha" TEXT,
    "monto" TEXT,
    "notas" TEXT
);
