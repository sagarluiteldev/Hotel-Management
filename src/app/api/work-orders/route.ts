import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";
import { workOrders as initialWorkOrders, WorkOrder } from "@/lib/hotel-data";

const updateWorkOrderSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["todo", "progress", "submitted"])
});

const statusMapToDb = {
  todo: "TODO",
  progress: "IN_PROGRESS",
  submitted: "SUBMITTED"
} as const;

const statusMapFromDb: Record<string, WorkOrder["status"]> = {
  TODO: "todo",
  IN_PROGRESS: "progress",
  SUBMITTED: "submitted",
  COMPLETED: "submitted"
};

const priorityMapFromDb: Record<string, WorkOrder["priority"]> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "High"
};

export async function GET() {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  if (hasDatabaseUrl() && session.id !== "demo-user") {
    try {
      const prisma = getPrisma();
      const dbWorkOrders = await prisma.workOrder.findMany({
        where: { userId: session.id },
        include: { room: true },
        orderBy: { dueAt: "asc" }
      });

      if (dbWorkOrders.length > 0) {
        const orders: WorkOrder[] = dbWorkOrders.map((wo) => {
          const daysLeft = Math.ceil((new Date(wo.dueAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const deadline =
            wo.status === "SUBMITTED" || wo.status === "COMPLETED"
              ? "Completed"
              : daysLeft <= 0
                ? "Due today"
                : `${daysLeft} days left`;

          return {
            id: wo.id,
            title: wo.title,
            course: wo.room?.title || "General",
            status: statusMapFromDb[wo.status] || "todo",
            priority: priorityMapFromDb[wo.priority] || "Medium",
            due: new Date(wo.dueAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            deadline
          };
        });

        return NextResponse.json({
          workOrders: orders,
          tasks: orders // Backward-compatibility
        });
      }
    } catch (err) {
      console.error("Error querying work orders from DB:", err);
    }
  }

  // Fallback to initial seeded work orders
  return NextResponse.json({ workOrders: initialWorkOrders, tasks: initialWorkOrders });
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = updateWorkOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid work order update payload." }, { status: 400 });
  }

  const { id, status } = parsed.data;

  if (hasDatabaseUrl() && session.id !== "demo-user") {
    try {
      const prisma = getPrisma();
      await prisma.workOrder.updateMany({
        where: { id, userId: session.id },
        data: { status: statusMapToDb[status] }
      });
    } catch (err) {
      console.error("Failed to update work order in DB:", err);
    }
  }

  return NextResponse.json({ ok: true, id, status });
}
