// src/app/manager/page.tsx

import {
  Package,
  BarChart,
  ArrowRight,
  Zap,
  Rocket,
  Smile,
} from "lucide-react";
import Image from "next/image";

export default function ManagerDashboard() {


  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Floating elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-100/30 rounded-full blur-3xl animate-pulse -rotate-45" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-300 skew-y-12" />

        <header className="mb-16 relative z-10">
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-400/10 rounded-full blur-2xl" />
          <h1 className="text-7xl font-bold text-slate-800 mb-6 transform skew-x-6 hover:skew-x-0 transition-all">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Gamja<span className="text-orange-400">.</span>Certified
            </span>
          </h1>
          <p className="text-2xl text-slate-600 max-w-3xl leading-relaxed skew-y-3 hover:skew-y-0 transition-transform">
            A SLIGHTLY{" "}
            <span className="bg-blue-100 px-4 py-2 rounded-xl rotate-3 inline-block border-2 border-blue-200">
              TILTING
            </span>{" "}
            <span className="text-pink-500 animate-pulse">EXPERIENCE</span>.
          </p>
          <div className="absolute top-24 right-10 w-48 h-48 z-20 rotate-12 animate-float">
            <Image
              src="/cat/cat1.png"
              alt="Decorative cat"
              width={192}
              height={192}
              className="object-cover hover:scale-110 transition-transform "
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 relative z-10">
          {/* Items Card */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-blue-100 hover:border-purple-300 transition-all duration-500 hover:scale-105 hover:-rotate-6 group relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-200/20 rounded-full blur-xl" />
            <div className="mb-6 flex items-center gap-4 -skew-x-6 hover:skew-x-0 transition-transform">
              <div className="w-16 h-16 bg-blue-400 rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                <Package className="w-10 h-10 text-white animate-bounce" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">
                What to sell
              </h2>
            </div>
            <p className="text-slate-600 mb-8 leading-relaxed text-xl">
              EZPZ RTZ inventory management. Get tilted with a few clicks.{" "}
              <Smile className="inline-block" />
            </p>
            <a
              href="/manager/items"
              className="inline-flex items-center gap-3 text-blue-400 hover:text-purple-500 font-medium text-xl transition-all"
            >
              Enter Inventory Hub
              <ArrowRight className="w-8 h-8 group-hover:rotate-45 transition-transform" />
            </a>
          </div>

          {/* Sales Card */}
          <div
            className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-blue-100 hover:border-green-300 transition-all duration-500 hover:scale-105 hover:rotate-3 group relative overflow-hidden"
            style={{ marginTop: "-2rem" }}
          >
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-green-200/20 rounded-full blur-xl" />
            <div className="mb-6 flex items-center gap-4 skew-x-6 hover:skew-x-0 transition-transform">
              <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform">
                <BarChart className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">
                What has sold
              </h2>
            </div>
            <p className="text-slate-600 mb-8 leading-relaxed text-xl">
              Numbers go brrrrrrrrr. <Rocket className="inline-block" /> Dive
              into the analytics suite for more.
            </p>
            <a
              href="/manager/sales"
              className="inline-flex items-center gap-3 text-green-400 hover:text-blue-500 font-medium text-xl transition-all"
            >
              Launch Analytics Suite
              <ArrowRight className="w-8 h-8 group-hover:rotate-45 transition-transform" />
            </a>
          </div>


          {/* Stats Card */}
          <div
            className="bg-gradient-to-br from-purple-400 to-blue-500 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden col-span-1 md:col-span-2 xl:col-span-1 group"
            style={{ marginTop: "3rem", rotate: "-5deg" }}
          >
            <div className="absolute -right-24 -top-24 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse" />
            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-4 skew-x-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center rotate-12">
                  <Zap className="w-10 h-10 text-white animate-spin-slow" />
                </div>
                <h2 className="text-3xl font-bold">Ready to slap</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm hover:skew-x-3 transition-transform">
                  <div className="text-lg opacity-90">ANGY</div>
                  <div className="text-4xl font-bold">CAT</div>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm hover:-skew-x-3 transition-transform">
                  <div className="text-lg opacity-90">
                    Lo5w .9888 SSSSSSSSSSSSSSSSSSSSSSSSSS
                  </div>
                  <div className="text-4xl font-bold">
                    WRITTEN BY CHARLIE&apos;S PAW
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating potato */}
        <div className="absolute bottom-24 left-0 w-48 h-48 z-0 animate-float-rotate">
          <div className="text-8xl">🥔</div>
        </div>
      </div>
    </div>
  );
}
