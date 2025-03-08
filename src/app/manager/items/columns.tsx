"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Edit, Trash2, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Define the Item type (adjust if using a shared type from your Prisma client)
export type Item = {
  id: number;
  barcode?: string | null;
  title: string;
  note?: string | null;
  price: number;
  inventory?: number | null;
  quickItem: boolean;
  imageUrl?: string | null;
  taxIncluded: boolean;
};

export const columns: ColumnDef<Item>[] = [
  {
    // Remove explicit "id" so the id defaults to "imageUrl"
    accessorKey: "imageUrl",
    header: "Image",
    enableSorting: false,
    cell: ({ row }) => {
      const imageUrl = row.getValue<string>("imageUrl");
      const title = row.original.title;
      return (
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              <ImageOff className="w-5 h-5 text-slate-400" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Product",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800">
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
    cell: ({ row }) => row.getValue("barcode") || "-",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = Number(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return (
        <div className="text-blue-600 font-medium text-right">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "inventory",
    header: "Inventory",
    cell: ({ row }) => {
      const inventory = row.getValue("inventory") as number | null | undefined;
      return (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            inventory !== undefined && inventory !== null && inventory > 0
              ? "bg-green-100 text-green-800"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {inventory !== undefined && inventory !== null ? inventory : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "taxIncluded",
    header: "Tax Included",
    cell: ({ row }) =>
      row.getValue("taxIncluded") ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <span className="text-slate-400">—</span>
      ),
  },
  {
    accessorKey: "quickItem",
    header: "Quick Add",
    cell: ({ row }) =>
      row.getValue("quickItem") ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <span className="text-slate-400">—</span>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-3">
          <Link
            href={`/manager/items/edit/${item.id}`}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5 text-slate-600" />
          </Link>
          <Button
            onClick={async () => {
              if (
                confirm("Are you sure you want to delete this item?")
              ) {
                await fetch(`/api/items/${item.id}`, {
                  method: "DELETE",
                });
                // Reload the page or update state accordingly
                window.location.reload();
              }
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </Button>
        </div>
      );
    },
  },
];
