import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00273D] to-[#00273D] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">TaskMaster</span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-sm">
              The ultimate productivity tool to help you manage tasks, collaborate with teams, and achieve your goals efficiently.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00273D]" />
                <span>hello@taskmaster.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00273D]" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00273D]" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Product</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">Features</Link></li>
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">Pricing</Link></li>
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">Integrations</Link></li>
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Company</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">About us</Link></li>
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">Blog</Link></li>
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">Careers</Link></li>
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">Press Kit</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">Help Center</Link></li>
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">Documentation</Link></li>
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">Community</Link></li>
              <li><Link href="/" className="hover:text-[#00273D] transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-b border-gray-300 py-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-bold mb-2 text-gray-900">Stay updated</h3>
            <p className="text-gray-600 mb-4 text-sm">Get the latest news and updates delivered to your inbox.</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00273D] focus:border-transparent"
              />
              <button className="px-6 py-2.5 bg-gradient-to-r from-[#00273D] to-[#00273D] text-white rounded-lg font-semibold hover:from-[#001D2E] hover:to-[#001D2E] transition-all duration-300 hover:scale-105 shadow-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2026 TaskMaster. All rights reserved.
          </p>
        

          {/* Legal Links */}
          <div className="flex gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#00273D] transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/" className="hover:text-[#00273D] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
