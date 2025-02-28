// src/app/manager/page.tsx

import { Package, BarChart, ArrowRight, Zap } from "lucide-react";
import Image from "next/image";
export default function ManagerDashboard() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 relative">

          <h1 className="text-5xl font-bold text-slate-800 mb-4 transform -rotate-2">
            Gamja<span className="text-blue-400">.</span>Certified
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
            A potato built this{" "}
            <span className="bg-blue-100 px-2 py-1 rounded-lg">Omega POS</span>.
            Enjoy your slightly tilting experience.
          </p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-xl" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">
        <Image
            src="/cat/cat1.png" // Ensure this image exists in your public folder
            alt="Decorative cat"
            width={192}
            height={192}
            className="absolute top-14 right-16 w-48 h-48 z-20  object-cover  hover:scale-105 transition-transform"
          />
          {/* Items Card */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 hover:scale-[1.02] group">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-400 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                What to sell
              </h2>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              EZPZ RTZ inventory management. Get tilted with a few clicks.
            </p>
            <a
              href="/manager/items"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-500 font-medium transition-colors"
            >
              Enter Inventory Hub
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Sales Card */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 hover:scale-[1.02] group">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-400 rounded-2xl flex items-center justify-center">
                <BarChart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                What has sold
              </h2>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Numbers go brrrrrrrrr. Dive into the analytics suite for more.
            </p>
            <a
              href="/manager/sales"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-500 font-medium transition-colors"
            >
              Launch Analytics Suite
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Stats Card */}
          <div className="bg-blue-400 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden col-span-1 md:col-span-2 xl:col-span-1 group">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Quick Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <div className="text-sm opacity-80">Today</div>
                  <div className="text-2xl font-bold">$2,450</div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  <div className="text-sm opacity-80">Low Stock Items</div>
                  <div className="text-2xl font-bold">12</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed bottom-0 left-0 w-full h-48 bg-gradient-to-t from-blue-400/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
