import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, User, X, SlidersHorizontal } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
}

export const MainLayout = ({ children, sidebarContent }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Sticky Top Navbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Mobile Menu Button & Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-bold tracking-tight">MSTORE</h1>
            </div>

            {/* Desktop Navigation Links (Hidden on Mobile) */}
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-sm font-semibold text-slate-900 border-b-2 border-slate-900 py-5">Home</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 py-5 transition-colors">Shop</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 py-5 transition-colors">Categories</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 py-5 transition-colors">Sale</a>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4 text-slate-600">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
                <Search size={20} />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
                <User size={20} />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
                <ShoppingBag size={20} />
                <span className="absolute top-1 right-1 bg-cyan-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Mobile Menu Drawer (Left Side) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative w-64 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6">
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-8">Menu</h2>
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-base font-semibold text-slate-900">Home</a>
              <a href="#" className="text-base font-medium text-slate-500">Shop</a>
              <a href="#" className="text-base font-medium text-slate-500">Categories</a>
              <a href="#" className="text-base font-medium text-slate-500">Sale</a>
              <hr className="my-4 border-slate-100" />
              <a href="#" className="text-base font-medium text-slate-500 flex items-center gap-2"><User size={18}/> Account</a>
              <a href="#" className="text-base font-medium text-slate-500 flex items-center gap-2"><Search size={18}/> Search</a>
            </nav>
          </div>
        </div>
      )}

      {/* 3. Mobile Filters Drawer (Right Side) */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden justify-end">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" 
            onClick={() => setIsMobileFiltersOpen(false)}
          ></div>
          <div className="relative w-72 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto pb-24">
            <button 
              onClick={() => setIsMobileFiltersOpen(false)} 
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <div className="mt-8">
              {sidebarContent}
            </div>
            <button 
              onClick={() => setIsMobileFiltersOpen(false)} 
              className="mt-8 w-full bg-slate-900 hover:bg-slate-800 transition-colors text-white py-3 rounded-xl font-medium shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar (Hidden on Mobile) */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-white p-2 sticky top-24">
            {sidebarContent}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {/* Mobile Filter Toggle Button */}
          <div className="md:hidden mb-6">
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 py-3 rounded-xl text-sm font-medium text-slate-700 shadow-sm active:scale-[0.98] transition-transform"
            >
              <SlidersHorizontal size={16} />
              Filter & Sort ({sidebarContent ? 'Active' : 'Off'})
            </button>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};