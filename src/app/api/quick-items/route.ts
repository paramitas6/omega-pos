// app/api/quick-items/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const quickItems = await db.item.findMany({
      where: { quickItem: true },
    });
    return NextResponse.json(quickItems);
  } catch (error) {
    console.error("Error fetching quick items:", error);
    return NextResponse.json(
      { error: "Failed to fetch quick items" },
      { status: 500 }
    );
  }
}