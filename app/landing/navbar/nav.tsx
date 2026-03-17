"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 left-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm'
        : 'bg-white border-b border-transparent'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-[#00273D] to-[#00273D] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-base">T</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            TaskMaster
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/cvgenerator"
            className="text-sm font-medium text-gray-700 hover:text-[#00273D] transition-colors relative group"
          >
            CV Generator
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00273D] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-700 hover:text-[#00273D] transition-colors relative group"
          >
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00273D] group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-[#00273D] transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-r from-[#00273D] to-[#00273D] px-6 py-2.5 text-sm font-semibold text-white hover:from-[#001D2E] hover:to-[#001D2E] shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-[#00273D] transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg">
          <nav className="flex flex-col gap-4 p-6">
            <Link
              href="/cvgenerator"
              className="text-sm font-medium text-gray-700 hover:text-[#00273D] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              CV Generator
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-700 hover:text-[#00273D] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#resources"
              className="text-sm font-medium text-gray-700 hover:text-[#00273D] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
              <Link
                href="/login"
                className="text-center text-sm font-medium text-gray-700 hover:text-[#00273D] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="text-center rounded-xl bg-gradient-to-r from-[#00273D] to-[#00273D] px-6 py-2.5 text-sm font-semibold text-white hover:from-[#001D2E] hover:to-[#001D2E] shadow-md transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}