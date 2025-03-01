// src/app/api/items/route.ts
// app/api/items/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract form data
    const barcode = formData.get("barcode") as string;
    const title = formData.get("title") as string;
    const note = formData.get("note") as string;
    const price = parseFloat(formData.get("price") as string);
    const inventory = parseInt(formData.get("inventory") as string);
    const quickItem = formData.get("quickItem") === "true";
    const imageFile = formData.get("image") as File | null;
    const imageName = formData.get("imageName") as string | null;
    const taxIncluded = formData.get("taxIncluded") === "true";

    // Handle file upload
    let imageUrl: string | undefined;
    if (imageFile && imageName) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Define upload path
      const uploadDir = join(process.cwd(), "public/uploads");
      const filename = imageName;
      const path = join(uploadDir, filename);
      
      // Write file to filesystem
      await writeFile(path, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    // Create database entry
    const newItem = await db.item.create({
      data: {
        barcode,
        title,
        note,
        price,
        inventory,
        quickItem,
        imageUrl,
        taxIncluded,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating item:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create item";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}



// src/app/api/items/route.ts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const barcode = searchParams.get("barcode");

    if (id) {
      const item = await db.item.findUnique({ where: { id: Number(id) } });
      return NextResponse.json(item);
    } else if (barcode) {
      const item = await db.item.findUnique({ where: { barcode } });
      return NextResponse.json(item);
    } else {
      const items = await db.item.findMany();
      return NextResponse.json(items);
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
