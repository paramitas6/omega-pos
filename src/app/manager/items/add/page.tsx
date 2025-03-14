// src/app/manager/items/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Loader2, ImageOff } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function AddNewItem() {
  const [formData, setFormData] = useState({
    barcode: "",
    title: "",
    note: "",
    price: "",
    inventory: "",
    taxIncluded: false,
    quickItem: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) data.append(key, value.toString());
      });

      if (image) {
        const uniqueFilename = `${uuidv4()}-${image.name}`;
        data.append("image", image);
        data.append("imageName", uniqueFilename);
      }

      const res = await fetch("/api/items", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error(await res.text());

      router.push("/manager/items");
      toast.success("Item added successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to add item. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Add New Item</h1>

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
                  onChange={handleFileChange}
                  capture="environment"
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Preview"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageOff className="w-8 h-8 text-slate-400 mb-2 mx-auto" />
                      <span className="text-sm text-slate-500">
                        Upload Image
                      </span>
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
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Barcode
                </label>
                <input
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price *
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Inventory
                </label>
                <input
                  name="inventory"
                  type="number"
                  value={formData.inventory}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg h-24"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.taxIncluded}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      taxIncluded: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 border-2 border-slate-300 rounded focus:ring-blue-400"
                />
                <label className="text-sm text-slate-700">
                  Tax Included (price already contains tax)
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.quickItem}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quickItem: e.target.checked,
                    }))
                  }
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
            disabled={isUploading}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Add Item"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
