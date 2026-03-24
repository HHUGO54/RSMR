-- CreateTable
CREATE TABLE "Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "hora" TEXT,
    "lugar" TEXT,
    "descripcion" TEXT,
    "responsable" TEXT,
    "contacto" TEXT,
    "telefono" TEXT
);
