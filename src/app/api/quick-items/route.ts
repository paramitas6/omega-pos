// pages/api/quick-items/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const barcode = searchParams.get("barcode");
  const quickItem = searchParams.get("quickItem");

  try {
    if (id) {
      const item = await db.item.findUnique({
        where: { id: Number(id) },
      });
      return NextResponse.json(item);
    } else if (barcode) {
      const item = await db.item.findUnique({
        where: { barcode },
      });
      return NextResponse.json(item);
    } else if (quickItem === "true") {
      const quickItems = await db.item.findMany({
        where: { quickItem: true },
      });
      return NextResponse.json(quickItems);
    } else {
      const items = await db.item.findMany();
      return NextResponse.json(items);
    }
  } catch (error) {
    console.error("Error fetching items:", error); // ✅ Log the error to avoid unused var warning
  
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
