import Image from "next/image";
import { Rocket, ShoppingCart, Smile, Zap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-1/4 w-64 h-64 bg-green-300/20 rounded-full blur-3xl animate-pulse delay-100" />
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse delay-200" />
      </div>

      <div className="relative z-10 max-w-4xl text-center p-8">
        {/* Animated floating potato */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 animate-float">
          <div className="bg-brown-500 w-48 h-48 rounded-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl">
              🥔
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-xl font-bold whitespace-nowrap">
              By GamjaNamja™
            </div>
          </div>
        </div>

        <h1 className="text-7xl font-black text-white mb-6 transform -rotate-3 animate-title-bounce">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">
            WHAT A P-O-S
          </span>
          <sup className="text-2xl ml-2 text-white/80">v4.20</sup>
        </h1>

        <p className="text-2xl text-white/90 mb-12 font-medium leading-relaxed">
          The <span className="bg-white/20 px-3 py-1 rounded-full">potato-powered</span> point-of-sale system
          that you&apos;ll wanna <span className="underline decoration-wavy decoration-yellow-300">YEET</span> 
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Manager Portal Card */}
          <a
            href="/manager"
            className="group relative p-8 bg-white/5 rounded-3xl border-2 border-white/20 hover:border-white/40 backdrop-blur-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-rotate-1"
          >
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Rocket className="w-8 h-8 text-yellow-400" />
              MAnAGE
            </h2>
            <p className="text-white/80 mb-6 text-left">
              <span className="bg-white/10 px-2 py-1 rounded-lg ml-2">POWERTHIRST</span> 
              and sales data does backflips
            </p>
            <div className="text-right text-blue-200 font-medium flex items-center justify-end gap-2">
              Launch Control 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </a>

          {/* Cashier Portal Card */}
          <a
            href="/cashier"
            className="group relative p-8 bg-white/5 rounded-3xl border-2 border-white/20 hover:border-white/40 backdrop-blur-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:rotate-1"
          >
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Smile className="w-8 h-8 text-pink-400" />
              CASH REGISTER
            </h2>
            <p className="text-white/80 mb-6 text-left">
              Laser go BeEEP $3.99
              <span className="bg-white/10 px-2 py-1 rounded-lg ml-2"></span> 
            </p>
            <div className="text-right text-green-200 font-medium flex items-center justify-end gap-2">
              Start Beeping
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </a>
        </div>

        {/* Bottom tagline */}
        <p className="mt-12 text-white/80 text-lg font-medium animate-pulse-slow">
           Coded by a 🔥🥔
          <br />
          Angy kitty so slappy
        </p>

        <div className="absolute top-32 right-12 w-48 z-20">
          <Image
            src="/cat/cat4.png" 
            alt="Decorative cat"
            width={192} 
            height={192} 
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </main>
  );
}
