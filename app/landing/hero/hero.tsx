"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, Sparkles, Stars } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        id="hero"
        className="relative pt-20 pb-16 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#EAF1F5] via-[#DCE7ED] to-[#C9DAE3]">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#C9DAE3] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-[#B7CBD7] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float delay-200" style={{animationDelay: '1s'}}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#A9C1CF] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float delay-400" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          {/* Badge with animation */}
          <div className={`inline-block mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#EAF1F5] to-[#EAF1F5] text-[#00273D] text-xs font-semibold rounded-full border border-[#B7CBD7] shadow-sm hover:shadow-md transition-shadow">
              <Sparkles className="w-3.5 h-3.5 animate-pulse-slow" />
              NEW: AI-POWERED SUGGESTIONS IS HERE!
            </div>
          </div>

          {/* Main Heading with staggered animation */}
          <h1 className={`text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Master your day,
            <br />
            <span className="bg-gradient-to-r from-[#00273D] via-[#00273D] to-[#001D2E] bg-clip-text text-transparent">
              one task at a time
            </span>
          </h1>

          {/* Subheading */}
          <p className={`mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            The simple way to manage projects, track progress, and stay focused on what matters most. No clutter, just productivity.
          </p>

          {/* CTA Buttons */}
          <div className={`mt-10 flex justify-center gap-4 flex-wrap transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00273D] to-[#00273D] px-8 py-4 text-base font-semibold text-white hover:from-[#001D2E] hover:to-[#001D2E] shadow-lg shadow-[#00273D]/30 hover:shadow-xl hover:shadow-[#00273D]/40 transition-all duration-300 hover:scale-105"
            >
              Get Started for Free
              <Stars className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>

            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white/80 backdrop-blur-sm px-8 py-4 text-base font-semibold text-gray-900 hover:bg-white hover:border-[#00273D] hover:text-[#00273D] transition-all duration-300 hover:scale-105"
            >
              <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Image - Below Hero */}
      <section className="pb-20 mt-16">
        <div className="relative w-full max-w-4xl px-6 mx-auto flex justify-center">
          <Image
            src="/ddd.png"
            alt="Dashboard Preview"
            width={8000}
            height={500}
            className="block shadow-2xl rounded-2xl border border-gray-200 max-w-full h-auto"
            priority
            unoptimized
          />
        </div>
      </section>


    </>
  );
}