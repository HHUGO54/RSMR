import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const z = searchParams.get("z");
    const x = searchParams.get("x");
    const y = searchParams.get("y");

    if (!z || !x || !y) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const zi = parseInt(z), xi = parseInt(x), yi = parseInt(y);
    if ([zi, xi, yi].some(isNaN) || zi < 0 || zi > 19) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const sub = ["a", "b", "c", "d"][xi % 4];
    const url = `https://${sub}.basemaps.cartocdn.com/rastertiles/voyager/${zi}/${xi}/${yi}.png`;

    const res = await fetch(url, {
      headers: { "User-Agent": "RSBMR-Electoral-App/1.0 (internal)" },
    });

    if (!res.ok) return NextResponse.json({ error: "Tile no encontrado" }, { status: 404 });

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Error al obtener tile" }, { status: 500 });
  }
}
