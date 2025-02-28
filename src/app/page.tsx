import Image from "next/image";
import { Rocket, ShoppingCart, Smile, Zap, ArrowRight, Monitor } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
      {/* Trippy background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[30rem] h-[30rem] bg-yellow-300/20 rounded-full blur-3xl animate-pulse -rotate-45" />
        <div className="absolute bottom-32 right-1/4 w-64 h-64 bg-green-300/20 rounded-full blur-3xl animate-pulse delay-100 skew-y-12" />
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse delay-200 -rotate-45" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/graph-paper.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-6xl text-center p-8">
        {/* Floating chaotic elements */}
        <div className="absolute -top-48 left-24 animate-float-rotate">
          <div className="bg-brown-500 w-64 h-64 rounded-full relative rotate-12">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-8xl">
              🥔
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-xl font-bold whitespace-nowrap rotate-12">
              By GamjaNamja™
            </div>
          </div>
        </div>

        <div className="absolute bottom-32 right-48 -translate-x-32 w-60 z-20 -rotate-12 animate-bob">
          <Image
            src="/cat/cat4.png"
            alt="Decorative cat"
            width={240}
            height={240}
            className="object-cover drop-shadow-2xl hover:scale-110 transition-transform"
          />
        </div>

        <h1 className="text-8xl font-black text-white mb-6 transform rotate-[356deg] skew-x-12 animate-title-bounce">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">
            WHAT A <span className="text-red-400">P-O-S</span>
          </span>
          <sup className="text-3xl ml-2 text-white/80">v4.20</sup>
        </h1>

        <p className="text-3xl text-white/90 mb-12 font-medium leading-relaxed max-w-2xl mx-auto skew-y-3 hover:skew-y-0 transition-transform">
          The <span className="bg-white/20 px-4 py-2 rounded-full rotate-3 inline-block">potato-powered</span> Point-of-sale you&apos;ll wanna
          <span className="text-yellow-300 mx-2 animate-pulse">⚡</span> 
          <span className="underline decoration-double decoration-red-400">YEET </span>
        </p>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Manager Portal */}
          <a
            href="/manager"
            className="relative p-8 bg-white/5 rounded-3xl border-2 border-white/20 hover:border-white/40 backdrop-blur-lg shadow-2xl transform rotate-3 transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:skew-y-3 group"
            style={{ top: '-2rem', left: '-5rem' }}
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-blue-400 rounded-2xl flex items-center justify-center shadow-lg rotate-12">
              <Zap className="w-10 h-10 text-white animate-bounce" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center gap-3 -skew-x-6">
              <Rocket className="w-10 h-10 text-yellow-400 animate-wiggle" />
              MAnAGE
            </h2>
            <p className="text-white/80 mb-6 text-left text-xl leading-relaxed">
              <span className="bg-white/10 px-4 py-2 rounded-lg -skew-x-6 inline-block">
                Turbo analytics
              </span> 
            </p>
            <div className="text-right text-blue-200 font-medium flex items-center justify-end gap-2 text-2xl">
              Launch Control 
              <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform" />
            </div>
          </a>

          {/* Cashier Portal */}
          <a
            href="/cashier"
            className="relative p-8 bg-white/5 rounded-3xl border-2 border-white/20 hover:border-white/40 backdrop-blur-lg shadow-2xl -rotate-6 transition-all duration-300 hover:scale-110 hover:rotate-6 hover:skew-y-3 group"
            style={{ top: '3rem' }}
          >
            <div className="absolute -top-8 -left-8 w-20 h-20 bg-green-400 rounded-2xl flex items-center justify-center shadow-lg -rotate-12">
              <ShoppingCart className="w-10 h-10 text-white animate-bounce" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center gap-3 skew-x-6">
              <Smile className="w-10 h-10 text-pink-400 animate-pulse" />
              CASHIER
            </h2>
            <p className="text-white/80 mb-6 text-left text-xl leading-relaxed">
              <span className="bg-white/10 px-4 py-2 rounded-lg skew-x-6 inline-block">
                BEEP BOOP $$$
              </span>
            </p>
            <div className="text-right text-green-200 font-medium flex items-center justify-end gap-2 text-2xl">
              Start Scanning
              <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform" />
            </div>
          </a>

          {/* Customer Display */}
          <a
            href="/customer-facing"
            className="relative p-8 bg-white/5 rounded-3xl border-2 border-white/20 hover:border-white/40 backdrop-blur-lg shadow-2xl -rotate-3 transition-all duration-300 hover:scale-110 hover:rotate-12 hover:skew-x-3 group"
            style={{ top: '-4rem', right: '-6rem' }}
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-purple-400 rounded-2xl flex items-center justify-center shadow-lg -rotate-12">
              <Monitor className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center gap-3 -skew-x-6">
              <Smile className="w-10 h-10 text-yellow-400 animate-spin-slow" />
              CUSTOMER
            </h2>
            <p className="text-white/80 mb-6 text-left text-xl leading-relaxed">
              <span className="bg-white/10 px-4 py-2 rounded-lg skew-x-6 inline-block">
                Live cart action
              </span>
            </p>
            <div className="text-right text-purple-200 font-medium flex items-center justify-end gap-2 text-2xl">
              Watch Total 
              <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform" />
            </div>
          </a>
        </div>

        {/* Bottom tagline */}
        <div className="mt-24 space-y-2 rotate-3">
          <p className="text-white/80 text-2xl font-medium animate-pulse-slow">
            <span className="text-red-300">⚠️ Warning:</span> Contains 420% daily recommended 
            <span className="text-yellow-300 mx-1">✨ potato power</span>
          </p>
          <div className="text-xl text-white/60">
            May cause sudden bursts of productivity
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>
    </main>
  );
}