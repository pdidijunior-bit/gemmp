import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Menu, 
  X, 
  Building2, 
  HardHat, 
  Info, 
  Zap, 
  Lock,
  Compass
} from 'lucide-react';
import { COMPANY_INFO, buildWhatsAppLink } from '../lib/constants';
import { GemmpLogo } from './GemmpLogo';

interface NavbarProps {
  onOpenSobreNos: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (cat: string) => void;
  ultraBoostActive: boolean;
  onToggleUltraBoost?: () => void;
  onScrollToCivil: () => void;
  onScrollToListings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSobreNos,
  onOpenAdmin,
  onSelectCategory,
  ultraBoostActive,
  onToggleUltraBoost,
  onScrollToCivil,
  onScrollToListings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Banner with Direct Contacts & UltraBoost Indicator */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="inline-flex items-center text-amber-400 font-bold tracking-tight">
              <Compass className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Kilamba & Futungo de Belas, Luanda
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-300 font-medium">
              {COMPANY_INFO.email}
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <a 
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="inline-flex items-center text-slate-200 hover:text-amber-400 font-bold transition-colors text-xs"
            >
              <Phone className="w-3 h-3 mr-1 text-amber-400" />
              <span className="hidden sm:inline">Ligar: </span>{COMPANY_INFO.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar - Primordial Yellow / Amber & Deep Navy Branding */}
      <nav className="bg-amber-500 text-slate-950 px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 border-amber-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo with Name on the side */}
          <div 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer group select-none"
            title="Gemmp Construção Civil & Imobiliária"
          >
            <GemmpLogo variant="horizontal" theme="light" size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 font-semibold text-sm text-slate-900">
            <button 
              onClick={() => {
                onSelectCategory('todos');
                onScrollToListings();
              }}
              className="px-3.5 py-2 rounded-lg hover:bg-amber-600/20 hover:text-slate-950 transition-colors flex items-center"
            >
              <Building2 className="w-4 h-4 mr-1.5 text-slate-900" />
              Imóveis & Lotes
            </button>

            <button 
              onClick={onScrollToCivil}
              className="px-3.5 py-2 rounded-lg hover:bg-amber-600/20 hover:text-slate-950 transition-colors flex items-center"
            >
              <HardHat className="w-4 h-4 mr-1.5 text-slate-900" />
              Construção Civil
            </button>

            <button 
              onClick={onOpenSobreNos}
              className="px-3.5 py-2 rounded-lg hover:bg-amber-600/20 hover:text-slate-950 transition-colors flex items-center"
            >
              <Info className="w-4 h-4 mr-1.5 text-slate-900" />
              Sobre Nós
            </button>

            <button 
              onClick={onOpenAdmin}
              className="px-3.5 py-1.5 rounded-lg text-slate-950 hover:bg-slate-950 hover:text-white transition-all flex items-center text-xs font-bold border border-slate-950/20"
              title="Acesso Gemmp"
            >
              <Lock className="w-3.5 h-3.5 mr-1 text-slate-800" />
              Entrar
            </button>
          </div>

          {/* Action CTAs (WhatsApp & Phone) */}
          <div className="hidden sm:flex items-center space-x-2">
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-4 h-4 mr-1.5 fill-white" />
              WhatsApp
            </a>

            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="inline-flex items-center px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-sm shadow-md transition-all border border-slate-800"
            >
              <Phone className="w-4 h-4 mr-1.5" />
              Ligar
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-600 text-white"
              title="Falar no WhatsApp"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-950 text-amber-400"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-amber-600/40 space-y-2 pb-2">
            <button
              onClick={() => {
                onSelectCategory('todos');
                onScrollToListings();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg bg-amber-400/50 font-bold text-slate-950 flex items-center"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Ver Todos os Imóveis & Lotes
            </button>

            <button
              onClick={() => {
                onScrollToCivil();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg bg-amber-400/50 font-bold text-slate-950 flex items-center"
            >
              <HardHat className="w-4 h-4 mr-2" />
              Serviços de Construção Civil & Obras
            </button>

            <button
              onClick={() => {
                onOpenSobreNos();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg bg-amber-400/50 font-bold text-slate-950 flex items-center"
            >
              <Info className="w-4 h-4 mr-2" />
              Sobre a Gemmp (Kilamba & Futungo)
            </button>

            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg bg-slate-950 text-white font-bold flex items-center justify-between text-xs"
            >
              <span className="flex items-center">
                <Lock className="w-4 h-4 mr-2 text-amber-400" />
                Entrar
              </span>
            </button>

            <div className="pt-2 flex gap-2">
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center text-sm"
              >
                <MessageCircle className="w-4 h-4 mr-1.5 fill-white" />
                WhatsApp
              </a>
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="flex-1 text-center py-2.5 bg-slate-950 text-amber-400 font-bold rounded-lg flex items-center justify-center text-sm"
              >
                <Phone className="w-4 h-4 mr-1.5" />
                Ligar Agora
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
