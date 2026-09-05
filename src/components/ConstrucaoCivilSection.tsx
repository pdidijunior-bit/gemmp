import React from 'react';
import { 
  HardHat, 
  Building, 
  Compass, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  Phone,
  Calculator,
  Hammer
} from 'lucide-react';
import { CIVIL_CONSTRUCTION_SERVICES, COMPANY_INFO, buildWhatsAppLink } from '../lib/constants';

interface ConstrucaoCivilSectionProps {
  onOpenLiveChatWithTopic: (topic: string) => void;
}

export const ConstrucaoCivilSection: React.FC<ConstrucaoCivilSectionProps> = ({
  onOpenLiveChatWithTopic,
}) => {
  return (
    <section id="construcao-civil" className="py-14 bg-slate-950 text-white relative overflow-hidden border-t-4 border-amber-500">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-400 text-xs font-black mb-3">
            <HardHat className="w-4 h-4" />
            <span>CONSTRUÇÃO CIVIL & ENGENHARIA DE CONFIANÇA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
            Construa Sem Dor de Cabeça: Do Alicerce ao Teto!
          </h2>
          <p className="text-sm sm:text-base text-slate-200 mt-3 leading-relaxed font-medium">
            Seja no Kilamba, Futungo de Belas ou em qualquer ponto de Luanda, nossa equipe de engenheiros e mestres de obras entrega a sua vivenda com rapidez, acabamento de luxo e preço justo!
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CIVIL_CONSTRUCTION_SERVICES.map((service, index) => {
            const icons = {
              Building: <Building className="w-6 h-6 text-slate-950" />,
              Compass: <Compass className="w-6 h-6 text-slate-950" />,
              Wrench: <Wrench className="w-6 h-6 text-slate-950" />,
              ShieldCheck: <ShieldCheck className="w-6 h-6 text-slate-950" />,
            };

            return (
              <div 
                key={service.id}
                className="bg-slate-900 rounded-2xl p-6 border-2 border-slate-800 hover:border-amber-500/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    {icons[service.icon as keyof typeof icons] || <HardHat className="w-6 h-6 text-slate-950" />}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-heading">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    {service.deliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800">
                  <a
                    href={buildWhatsAppLink(`Olá Gemmp! Gostaria de um orçamento para o serviço: ${service.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-xs font-bold transition-all flex items-center justify-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                    Pedir Orçamento
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Construction Quick Estimate Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-slate-950 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider bg-slate-950 text-amber-400 px-3 py-1 rounded-md inline-block">
              Precisa Construir ou Reformar?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
              Faça o seu Projeto ou Obra com a Equipe de Engenharia da Gemmp
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
              Atendimento personalizado para clientes em Angola e na Diáspora. Acompanhe a sua obra através de relatórios técnicos e filmagens semanais.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={buildWhatsAppLink('Olá Gemmp! Gostaria de solicitar um orçamento para construção civil/obra no Kilamba/Futungo.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-sm flex items-center shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 mr-2 fill-amber-400" />
              Solicitar Orçamento no WhatsApp
            </a>

            <button
              onClick={() => onOpenLiveChatWithTopic('Construção Civil & Obras')}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm flex items-center shadow transition-colors"
            >
              <Calculator className="w-4 h-4 mr-2 text-amber-600" />
              Falar com Engenheiro no Chat
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
