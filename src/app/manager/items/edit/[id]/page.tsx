// src/app/manager/items/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ImageOff, Trash2 } from "lucide-react";
import { Item } from "@prisma/client";
import { toast } from "sonner";
import Image from "next/image";

export default function EditItem() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/items?id=${id}`);
      const data = await res.json();
      setItem(data);
      if (data.imageUrl) setPreview(data.imageUrl);
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", item.title);
      data.append("barcode", item.barcode || "");
      data.append("note", item.note || "");
      data.append("price", item.price.toString());
      data.append("inventory", item.inventory?.toString() || "");
      data.append("quickItem", item.quickItem.toString());

      if (newImage) {
        const uniqueFilename = `${Date.now()}-${newImage.name}`;
        data.append("image", newImage);
        data.append("imageName", uniqueFilename);
      }

      const res = await fetch(`/api/items/${id}`, {
        method: "PUT",
        body: data,
      });

      if (!res.ok) throw new Error(await res.text());
      
      router.push("/manager/items");
      toast.success("Item updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update item");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return (
    <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Edit Item</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product Image
              </label>
              <div className="w-40 h-40 rounded-lg border-2 border-dashed border-slate-200 relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewImage(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  {preview ? (
                    <div className="relative">
                      <Image
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setNewImage(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageOff className="w-8 h-8 text-slate-400 mb-2 mx-auto" />
                      <span className="text-sm text-slate-500">Upload Image</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 col-span-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title *
                </label>
                <input
                  value={item.title}
                  onChange={(e) => setItem(prev => prev ? {...prev, title: e.target.value} : null)}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Barcode
                </label>
                <input
                  value={item.barcode || ""}
                  onChange={(e) => setItem(prev => prev ? {...prev, barcode: e.target.value} : null)}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => setItem(prev => prev ? {...prev, price: parseFloat(e.target.value)} : null)}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Inventory
                </label>
                <input
                  type="number"
                  value={item.inventory || ""}
                  onChange={(e) => setItem(prev => prev ? {...prev, inventory: Number(e.target.value)} : null)}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={item.note || ""}
                  onChange={(e) => setItem(prev => prev ? {...prev, note: e.target.value} : null)}
                  className="w-full p-3 border border-slate-300 rounded-lg h-24"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.quickItem}
                  onChange={(e) => setItem(prev => prev ? {...prev, quickItem: e.target.checked} : null)}
                  className="w-5 h-5 border-2 border-slate-300 rounded focus:ring-blue-400"
                />
                <label className="text-sm text-slate-700">
                  Show in Quick Add menu
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Update Item'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}