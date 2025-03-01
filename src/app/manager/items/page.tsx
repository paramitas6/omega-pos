// src/app/manager/items/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Item } from "@prisma/client";
import { Trash2, Edit, CheckCircle, ImageOff } from "lucide-react";
import Image from "next/image";
import CatAnimation from "@/components/CatAnimation";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("/api/items");
      const data = await res.json();
      setItems(data);
    };
    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await fetch(`/api/items/${id}`, { method: "DELETE" });
      setItems(items.filter((item) => item.id !== id));
    }
  };

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

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold">
                    Barcode
                  </th>
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold">
                    Price
                  </th>
                  {/* Add Tax Status column */}
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold">
                    Inventory
                  </th>
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold">
                    Tax Included
                  </th>
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold">
                    Quick Add
                  </th>
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                            <ImageOff className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.barcode || "-"}
                    </td>
                    <td className="px-6 py-4 text-blue-600 font-medium">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          item.inventory !== undefined &&
                          item.inventory !== null &&
                          item.inventory > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.inventory !== undefined ? item.inventory : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.taxIncluded ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {item.quickItem ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/manager/items/edit/${item.id}`}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5 text-slate-600" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No items found. Add your first item to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
