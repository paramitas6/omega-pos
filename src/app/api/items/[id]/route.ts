// src/app/api/items/[id]/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function PUT(request: Request, context: { params: Promise< { id: string } >}) {
  const { id } = await context.params;
  
  try {
    const formData = await request.formData();
    
    // Extract form data
    const barcode = formData.get("barcode") as string;
    const title = formData.get("title") as string;
    const note = formData.get("note") as string;
    const price = parseFloat(formData.get("price") as string);
    const inventory = formData.get("inventory") as string;
    const taxIncluded = formData.get("taxIncluded") === "true";
    const quickItem = formData.get("quickItem") === "true";
    const imageFile = formData.get("image") as File | null;
    const imageName = formData.get("imageName") as string | null;

    // Handle file upload
    let imageUrl: string | undefined;
    if (imageFile && imageName) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Define upload path
      const uploadDir = join(process.cwd(), "public/uploads");
      const filename = imageName;
      const filePath = join(uploadDir, filename);
      
      // Write file to filesystem
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const updatedItem = await db.item.update({
      where: { id: Number(id) },
      data: {
        barcode,
        title,
        note,
        price,
        taxIncluded,
        quickItem,
        inventory: inventory ? parseInt(inventory) : null,
        imageUrl: imageUrl || undefined,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await db.item.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
