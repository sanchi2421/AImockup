"use client";

import React, { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Main container for nav and profile */}
          <div className="flex items-center w-full">
            {/* Desktop Navigation - moved slightly left */}
            <nav className="hidden lg:flex items-center space-x-8 mr-auto -ml-2">
              <a
                href="#dashboard"
                className="text-purple-300 hover:text-purple-200 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-purple-800/30 hover:backdrop-blur-sm border-b-2 border-purple-400"
              >
                Dashboard
              </a>
              <a
                href="#questions"
                className="text-white hover:text-purple-200 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-purple-800/20"
              >
                Questions
              </a>
              <a
                href="#upgrade"
                className="text-white hover:text-purple-200 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-purple-800/20"
              >
                Upgrade
              </a>
              <a
                href="#how-it-works"
                className="text-white hover:text-purple-200 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-purple-800/20"
              >
                How it Works?
              </a>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* Desktop Search */}
              

              {/* Clerk User Button */}
              <div className="flex items-center">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-20 h-10 border-2 border-white/20 hover:border-white/40 transition-all duration-200",
                      userButtonPopoverCard: "bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl",
                      userButtonPopoverActions: "bg-white/95",
                      userButtonPopoverActionButton: "hover:bg-blue-50 text-gray-700 hover:text-blue-600",
                      userButtonPopoverActionButtonText: "text-sm font-medium",
                      userButtonPopoverFooter: "bg-white/95"
                    }
                  }}
                  afterSignOutUrl="/sign-in"
                />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 text-white hover:text-purple-200 rounded-lg hover:bg-purple-800/20 transition-all duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-white/20 shadow-xl z-40">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#dashboard"
                className="block text-white hover:text-purple-200 py-2 px-3 rounded-lg hover:bg-purple-800/30 transition-all duration-200"
              >
                Dashboard
              </a>
              <a
                href="#questions"
                className="block text-white hover:text-purple-200 py-2 px-3 rounded-lg hover:bg-purple-800/20 transition-all duration-200"
              >
                Questions
              </a>
              <a
                href="#upgrade"
                className="block text-white hover:text-purple-200 py-2 px-3 rounded-lg hover:bg-purple-800/20 transition-all duration-200"
              >
                Upgrade
              </a>
              <a
                href="#how-it-works"
                className="block text-white hover:text-purple-200 py-2 px-3 rounded-lg hover:bg-purple-800/20 transition-all duration-200"
              >
                How it Works?
              </a>

              {/* Mobile Search */}
              <div className="pt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/60" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;