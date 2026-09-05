import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  HardHat, 
  ShieldCheck, 
  Lock,
  ArrowUp
} from 'lucide-react';
import { COMPANY_INFO, buildWhatsAppLink } from '../lib/constants';
import { GemmpLogo } from './GemmpLogo';

interface FooterProps {
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAbout }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white border-t-4 border-amber-500 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Presentation */}
          <div className="space-y-4">
            <GemmpLogo variant="horizontal" theme="dark" size="md" />

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              A imobiliária e construtora de confiança no Kilamba e Futungo de Belas. Realizamos o sonho da sua casa própria e construímos com rapidez, segurança e rigor em Luanda e em toda Angola!
            </p>

            <div className="pt-1">
              <a
                href={buildWhatsAppLink('Olá Gemmp! Desejo atendimento promocional agora.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 mr-1.5 fill-white" />
                Falar Connosco no WhatsApp
              </a>
            </div>
          </div>

          {/* Col 2: Serviços & Categorias */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Imóveis & Loteamentos
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#imoveis-listados" className="hover:text-amber-400 transition-colors">
                  • Casas T1, T2, T3 e T4+
                </a>
              </li>
              <li>
                <a href="#imoveis-listados" className="hover:text-amber-400 transition-colors">
                  • Vivendas em Condomínio Fechado
                </a>
              </li>
              <li>
                <a href="#imoveis-listados" className="hover:text-amber-400 transition-colors">
                  • Terrenos & Lotes 20x30 no Futungo
                </a>
              </li>
              <li>
                <a href="#imoveis-listados" className="hover:text-amber-400 transition-colors">
                  • Apartamentos no Kilamba
                </a>
              </li>
              <li>
                <a href="#imoveis-listados" className="hover:text-amber-400 transition-colors">
                  • Espaços Comerciais & Escritórios
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Engenharia Civil & Rigor */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Construção Civil & Obras
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#construcao-civil" className="hover:text-amber-400 transition-colors">
                  • Construção Chave na Mão
                </a>
              </li>
              <li>
                <a href="#construcao-civil" className="hover:text-amber-400 transition-colors">
                  • Projetos de Arquitetura & Estruturas
                </a>
              </li>
              <li>
                <a href="#construcao-civil" className="hover:text-amber-400 transition-colors">
                  • Reformas, Pinturas & Acabamentos
                </a>
              </li>
              <li>
                <a href="#construcao-civil" className="hover:text-amber-400 transition-colors">
                  • Fiscalização Técnica para a Diáspora
                </a>
              </li>
              <li>
                <button 
                  onClick={onOpenAbout} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  • Conheça a História da Gemmp
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contatos & Localização */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Canais Oficiais
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{COMPANY_INFO.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono text-[11px]">{COMPANY_INFO.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Gemmp Construção Civil & Imobiliária. Todos os direitos reservados. Luanda - Angola.
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAbout}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Sobre Nós
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center hover:text-amber-400 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 mr-1" />
              Topo
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
