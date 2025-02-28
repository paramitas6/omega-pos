// src/app/manager/layout.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, Package, BarChart, Zap } from "lucide-react";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden sm:block w-64 bg-gray-800 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Manage</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/manager">
            <div className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-700">
              <Zap className="mr-2" />
              Dashboard
            </div>
          </Link>
          <Link href="/manager/items">
            <div className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-700">
              <Package className="mr-2" />
              Items
            </div>
          </Link>
          <Link href="/manager/sales">
            <div className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-700">
              <BarChart className="mr-2" />
              Sales
            </div>
          </Link>
        </nav>
        <Image
          src="/cat/cat6.png" // Ensure this image exists in your public folder
          alt="Decorative cat"
          width={192}
          height={192}
          className="absolute bottom-2 w-48  z-20  object-cover  hover:scale-105 transition-transform"
        />
      </aside>

      {/* Mobile Header */}
      <div className="sm:hidden w-full bg-gray-800 text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Manage</h2>
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-800 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 left-0 w-64 bg-gray-800 text-white p-6 space-y-6 h-full">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manage</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              <Link href="/manager" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-700">
                  <Zap className="mr-2" />
                  Dashboard
                </div>
              </Link>
              <Link href="/manager/items" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-700">
                  <Package className="mr-2" />
                  Items
                </div>
              </Link>
              <Link href="/manager/sales" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-700">
                  <BarChart className="mr-2" />
                  Sales
                </div>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
}
