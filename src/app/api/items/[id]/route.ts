// src/app/api/items/[id]/route.ts

import { NextResponse } from "next/server";
import db from "@/lib/db";


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params before using its properties
  const { id } = await params;
  try {
    const deletedItem = await db.item.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(deletedItem);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  const { barcode, title, note, price, inventory } = data;
  try {
    const updatedItem = await db.item.update({
      where: { id: Number(id) },
      data: {
        barcode,
        title,
        note,
        price: parseFloat(price),
        // If inventory is provided, update it; otherwise, set it to undefined.
        inventory: inventory ? parseInt(inventory, 10) : undefined,
      },
    });
    return NextResponse.json(updatedItem);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
