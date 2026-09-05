import React from 'react';
import { 
  Building2, 
  HardHat, 
  MapPin, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  ArrowDown
} from 'lucide-react';
import { COMPANY_INFO, buildWhatsAppLink } from '../lib/constants';

interface HeroBannerProps {
  onScrollToListings: () => void;
  onScrollToCivil: () => void;
  onOpenSobreNos: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onScrollToListings,
  onScrollToCivil,
  onOpenSobreNos,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white border-b-4 border-amber-500">
      {/* High-Resolution Realistic Modern Vivenda Background with High Clarity & Sharpness */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-65 scale-100"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=90')`
        }}
      />
      {/* Balanced Slate/Navy Gradient Overlay ensuring the luxury villa is crisp while text is crystal clear */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/40" />
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      
      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-14 sm:pt-10 sm:pb-20">
        {/* Casual & Promotional Announcement Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/30 border border-amber-400/70 text-amber-300 text-xs sm:text-sm font-black mb-5 shadow-lg backdrop-blur-sm">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping mr-1" />
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>OPORTUNIDADES DE INVESTIMENTO • TODA A PROVÍNCIA DE LUANDA</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Description */}
          <div className="lg:col-span-8 space-y-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-heading drop-shadow-md">
              Construção Civil & Imóveis de Alto Padrão em Toda Luanda
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl leading-relaxed font-medium drop-shadow-sm">
              Vem para a <strong className="text-amber-400 font-black">Gemmp Construção Civil & Imobiliária</strong>! 
              Atuamos em toda a província de Luanda — Kilamba, Futungo de Belas, Talatona, Viana, Benfica, Camama e mais. 
              Temos os melhores lotes documentados, vivendas modernas prontas a habitar e opções de <strong className="text-white font-bold">T1 a T4+</strong> com facilidades de pagamento, além de projetos de engenharia e obras completas chave na mão.
            </p>

            {/* Promotional Trust Badges */}
            <div className="flex flex-wrap gap-y-2 gap-x-3 pt-1 text-xs sm:text-sm text-slate-200 font-bold">
              <div className="flex items-center space-x-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Terrenos 100% Legalizados</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Obra Chave na Mão Garantida</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Atendimento Rápido e Sem Burocracia</span>
              </div>
            </div>

            {/* Direct Interaction Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onScrollToListings}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all flex items-center transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Ver Lotes e Casas Disponíveis
                <ArrowDown className="w-4 h-4 ml-2 animate-bounce" />
              </button>

              <a
                href={buildWhatsAppLink('Olá Gemmp! Vi o site e quero aproveitar as ofertas de imóveis e construção civil no Kilamba/Futungo!')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-md transition-all flex items-center transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-white" />
                Chamar no WhatsApp
              </a>

              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-400 font-bold text-sm sm:text-base transition-all flex items-center"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-400" />
                {COMPANY_INFO.phone}
              </a>
            </div>
          </div>

          {/* Side Feature Card - Kilamba & Futungo Hub */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 rounded-2xl border-2 border-amber-500/50 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-amber-500/10 rounded-full blur-xl" />
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                  <MapPin className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">Escritório & Plantão</h2>
                  <p className="text-xs text-amber-400 font-extrabold">Toda Luanda • Sede: Kilamba & Futungo</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Fale direto com a nossa equipe! Temos corretores de plantão prontos para agendar visitas aos lotes e engenheiros para orçar a sua obra sem compromisso.
              </p>

              <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">WhatsApp Direto:</span>
                  <span className="text-amber-300 font-black">+244 935 973 494</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">E-mail Comercial:</span>
                  <span className="text-slate-200 font-mono text-[11px] truncate max-w-[180px]">{COMPANY_INFO.email}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Plantão de Visitas:</span>
                  <span className="text-emerald-400 font-black">Segunda a Domingo</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex gap-2">
                <button
                  onClick={onScrollToCivil}
                  className="flex-1 py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors text-center"
                >
                  Construção & Obras
                </button>
                <button
                  onClick={onOpenSobreNos}
                  className="py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors"
                >
                  Sobre Nós
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
