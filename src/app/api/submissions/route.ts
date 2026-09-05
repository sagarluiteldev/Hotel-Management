import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (
      msg.toLowerCase().includes("size") ||
      msg.toLowerCase().includes("limit") ||
      msg.toLowerCase().includes("large") ||
      msg.toLowerCase().includes("overflow")
    ) {
      return NextResponse.json({ error: "Uploaded file exceeds maximum allowed size (10MB)." }, { status: 413 });
    }
    return NextResponse.json({ error: "Invalid form data submission." }, { status: 400 });
  }

  const workOrderId = String(formData.get("workOrderId") || formData.get("taskId") || "");
  const note = String(formData.get("note") || "");
  const file = formData.get("file");

  let fileName: string | undefined = undefined;
  let fileUrl: string | undefined = undefined;

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_EXTENSIONS = new Set([".pdf", ".zip", ".png", ".jpg", ".jpeg"]);
  const ALLOWED_MIME_TYPES = new Set([
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "image/png",
    "image/jpeg"
  ]);

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB maximum limit." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed formats: PDF, ZIP, PNG, JPG." },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported MIME type (${file.type}). Allowed formats: PDF, ZIP, PNG, JPG.` },
        { status: 400 }
      );
    }

    fileName = file.name;
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${cleanFileName}`;

    try {
      // Attempt local filesystem storage
      const uploadDir = path.join(process.cwd(), "public", "uploads", "submissions");
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, uniqueFileName);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));

      fileUrl = `/uploads/submissions/${uniqueFileName}`;
    } catch {
      // Fallback for read-only serverless environments (e.g. Vercel, AWS Lambda)
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mime = file.type || "application/octet-stream";
      fileUrl = `data:${mime};base64,${base64}`;
    }
  }

  let submissionId: string = crypto.randomUUID();

  if (hasDatabaseUrl()) {
    try {
      const prisma = getPrisma();
      const submission = await prisma.submission.create({
        data: {
          workOrderId: workOrderId || undefined,
          userId: session.id,
          note,
          fileName,
          fileUrl
        }
      });
      submissionId = submission.id;

      // Automatically update work order status to SUBMITTED if workOrderId exists
      if (workOrderId) {
        await prisma.workOrder.updateMany({
          where: { id: workOrderId },
          data: { status: "SUBMITTED" }
        });
      }
    } catch (err) {
      console.error("Error persisting work order submission in DB:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    submission: {
      id: submissionId,
      workOrderId,
      taskId: workOrderId,
      note,
      fileName,
      fileUrl,
      createdAt: new Date().toISOString()
    }
  });
}
