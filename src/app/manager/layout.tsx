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
    <div className="min-h-screen flex flex-col sm:flex-row bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden sm:block w-72 bg-gradient-to-b from-purple-900/50 to-blue-900/50 text-white p-8 space-y-10 relative overflow-hidden border-r-2 border-white/10">
        {/* Background elements */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full blur-xl" />
        
        <h2 className="text-3xl font-bold rotate-3 transform hover:rotate-0 transition-transform">
          Manage
          <span className="text-yellow-400 ml-2 animate-pulse">⚡</span>
        </h2>
        
        <nav className="flex flex-col gap-4">
          {[
            { href: "/manager", icon: <Zap className="mr-2 w-6 h-6" />, text: "Dashboard" },
            { href: "/manager/items", icon: <Package className="mr-2 w-6 h-6" />, text: "Items" },
            { href: "/manager/sales", icon: <BarChart className="mr-2 w-6 h-6" />, text: "Sales" },
          ].map((link, index) => (
            <Link href={link.href} key={index}>
              <div className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-all transform hover:translate-x-4 hover:skew-x-6 cursor-pointer border-2 border-transparent hover:border-white/20">
                {link.icon}
                <span className="text-xl">{link.text}</span>
              </div>
            </Link>
          ))}
        </nav>
        
        <Image
          src="/cat/cat6.png"
          alt="Decorative cat"
          width={240}
          height={240}
          className="absolute bottom-8  w-72 rotate-12 opacity-80 hover:rotate-45 transition-transform duration-500"
        />
        
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </aside>

      {/* Mobile Header */}
      <div className="sm:hidden w-full bg-gray-900 text-white p-6 flex items-center justify-between border-b-2 border-white/10">
        <h2 className="text-2xl font-bold rotate-2">Manage</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <Menu className="w-8 h-8 animate-pulse" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 left-0 w-3/4 h-full bg-gradient-to-b from-purple-900 to-blue-900 p-8 space-y-10 border-r-2 border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold rotate-3">Manage</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {[
                { href: "/manager", icon: <Zap className="w-6 h-6" />, text: "Dashboard" },
                { href: "/manager/items", icon: <Package className="w-6 h-6" />, text: "Items" },
                { href: "/manager/sales", icon: <BarChart className="w-6 h-6" />, text: "Sales" },
              ].map((link, index) => (
                <Link href={link.href} key={index} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-all transform hover:translate-x-4">
                    {link.icon}
                    <span className="text-xl ml-2">{link.text}</span>
                  </div>
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-8 left-8 w-48 h-48 opacity-30">
              <div className="text-8xl">🥔</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 bg-gradient-to-br from-blue-50/50 to-purple-50/50 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}