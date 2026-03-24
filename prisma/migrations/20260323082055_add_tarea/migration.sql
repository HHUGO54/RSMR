-- CreateTable
CREATE TABLE "Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texto" TEXT NOT NULL,
    "nota" TEXT,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "equipoId" INTEGER NOT NULL,
    CONSTRAINT "Tarea_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "EquipoCompromiso" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
