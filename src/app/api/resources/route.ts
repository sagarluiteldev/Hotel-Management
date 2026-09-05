import { NextResponse } from "next/server";
import { resources } from "@/lib/hotel-data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("file") ?? "";
  const resource = resources.find((item) => item.slug === slug) ?? resources[0];
  const body = [
    `HOTEL OPERATIONS MANUAL & STANDARD OPERATING PROCEDURE`,
    `======================================================`,
    `Document: ${resource.title}`,
    `Assigned Area: ${resource.course}`,
    `Standard: 5-Star Luxury Hospitality Protocol`,
    ``,
    `This operational SOP document is authorized by Grand Haven Hotel & Suites Operations Management.`,
    `All hotel department staff must adhere strictly to these safety, sanitization, and guest service guidelines.`
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${resource.slug}.txt"`
    }
  });
}
