import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";
import { staff as initialStaff, StaffMember } from "@/lib/hotel-data";

export async function GET() {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  if (hasDatabaseUrl()) {
    try {
      const prisma = getPrisma();
      const dbStaff = await prisma.staff.findMany({
        orderBy: { rating: "desc" }
      });

      if (dbStaff.length > 0) {
        const staffList: StaffMember[] = dbStaff.map((s) => ({
          name: s.name,
          title: s.title,
          rating: s.rating,
          bio: s.bio,
          nextSession: s.nextShift || "Upcoming",
          avatar: s.avatarUrl || initialStaff[0].avatar,
          specialty: s.specialty || "General"
        }));

        return NextResponse.json({
          staff: staffList,
          teachers: staffList // Backward-compatibility
        });
      }
    } catch (err) {
      console.error("Failed to query staff from DB:", err);
    }
  }

  return NextResponse.json({ staff: initialStaff, teachers: initialStaff });
}
