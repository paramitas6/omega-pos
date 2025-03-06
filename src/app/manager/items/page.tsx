import { DataTable } from "./data-table";
import { columns, Item } from "./columns";
import CatAnimation from "@/components/CatAnimation";
import Link from "next/link";
import Image from "next/image";
// Example data fetching function.
// Replace this with your Prisma query or API call as needed.
async function getItems(): Promise<Item[]> {
  const res = await fetch("http://localhost:3000/api/items", {
    cache: "no-store",
  });
  const data: Item[] = await res.json();
  // Sort items by id descending (latest first)
  return data.sort((a, b) => b.id - a.id);
}

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <CatAnimation imageSrc="/cat/cat5.png" size={200} chaseSpeed={0.1} />

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Manage Items</h1>
          <Link href="/manager/items/add">
            <button className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              Add New Item
            </button>
          </Link>
        </div>
        <Image
        src="/cat/cat9.png" // Ensure this image exists in your public folder
        alt="Decorative cat"
        width={500}
        height={500}
        className="absolute translate-x-40 -translate-y-28 w-40 z-20  object-cover  hover:scale-110 transition-transform"
      />
        <DataTable columns={columns} data={items} />
      </div>
    </div>
  );
}
