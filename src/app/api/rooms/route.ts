import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";
import { rooms as initialRooms, Room } from "@/lib/hotel-data";

export async function GET() {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  if (hasDatabaseUrl()) {
    try {
      const prisma = getPrisma();
      const dbRooms = await prisma.room.findMany({
        orderBy: { createdAt: "asc" }
      });

      if (dbRooms.length > 0) {
        const roomsList: Room[] = dbRooms.map((r) => ({
          title: r.title,
          tags: r.tags.length > 0 ? r.tags : ["Luxury Suite", "King Bed"],
          progress: r.progress,
          icon: (r.icon as Room["icon"]) || "layout",
          accent: (r.accent as Room["accent"]) || "teal",
          time: r.pricePerNight || "$350/night"
        }));

        return NextResponse.json({
          rooms: roomsList,
          courses: roomsList // Backward-compatibility
        });
      }
    } catch (err) {
      console.error("Failed to query rooms from DB:", err);
    }
  }

  return NextResponse.json({ rooms: initialRooms, courses: initialRooms });
}
