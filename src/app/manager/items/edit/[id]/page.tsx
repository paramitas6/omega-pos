// src/app/manager/items/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ImageOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

export default function EditItem() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    barcode: "",
    note: "",
    price: "",
    inventory: "",
    taxIncluded: false,
    quickItem: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/items?id=${id}`);
      const data = await res.json();
      setFormData({
        title: data.title,
        barcode: data.barcode || "",
        note: data.note || "",
        price: data.price.toString(),
        inventory: data.inventory?.toString() || "",
        taxIncluded: data.taxIncluded,
        quickItem: data.quickItem,
      });
      if (data.imageUrl) setPreview(data.imageUrl);
    };
    fetchItem();
  }, [id]);

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
      setIsUploading(false);
    }
  };

  if (!formData.title) return (
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
                  capture="environment"
                  onChange={handleFileChange}
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
                        width={160}
                        height={160}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setImage(null);
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
                  name="taxIncluded"
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
                  name="quickItem"
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
              'Update Item'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}