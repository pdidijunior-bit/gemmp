import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  HardHat, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MessageCircle,
  Users,
  Target,
  Award
} from 'lucide-react';
import { COMPANY_INFO, buildWhatsAppLink } from '../lib/constants';
import { GemmpLogo } from './GemmpLogo';

interface SobreNosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SobreNosModal: React.FC<SobreNosModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'historia' | 'kilamba_futungo' | 'servicos' | 'seguranca'>('historia');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      {/* Sliding Drawer Container */}
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l-4 border-amber-500 transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right"
      >
        {/* Drawer Header with GemmpLogo */}
        <div className="bg-slate-950 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-500 shrink-0">
          <GemmpLogo variant="horizontal" theme="dark" size="sm" />

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliding Tabs Navigation */}
        <div className="bg-slate-100 p-2 flex gap-1 border-b border-slate-200 overflow-x-auto shrink-0 scrollbar-thin">
          <button
            onClick={() => setActiveTab('historia')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'historia' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Quem Somos
          </button>
          <button
            onClick={() => setActiveTab('kilamba_futungo')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'kilamba_futungo' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Kilamba & Futungo
          </button>
          <button
            onClick={() => setActiveTab('servicos')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'servicos' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Nossos Serviços
          </button>
          <button
            onClick={() => setActiveTab('seguranca')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'seguranca' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Garantia & Jurídico
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-700 text-sm leading-relaxed">
          
          {activeTab === 'historia' && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-44 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1000&q=80"
                  alt="Obras e Engenharia Gemmp"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-4">
                  <span className="text-white font-extrabold text-base font-heading">
                    Compromisso e Rigor em Cada Detalhe
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-950 font-heading">
                A Força da Construção Civil e Mediação Imobiliária em Angola
              </h3>

              <p>
                A <strong>Gemmp Construção Civil & Imobiliária</strong> nasceu para preencher uma lacuna fundamental no mercado angolano: a união entre a <strong>solidez da engenharia civil</strong> e a <strong>transparência total na compra, venda e arrendamento de imóveis</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 text-xs mb-1">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>Nossa Missão</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Proporcionar moradias dignas, obras com rigor milimétrico e negócios imobiliários sem surpresas negativas.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 text-xs mb-1">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Nossos Valores</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Honestidade contratual, cumprimento estrito de cronogramas e respeito total ao patrimônio do cliente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kilamba_futungo' && (
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-slate-950 font-heading">
                Nossa Presença Estratégica: Kilamba & Futungo de Belas
              </h3>

              <p>
                Escolhemos estabelecer nossa presença operacional nas regiões que mais crescem e valorizam na província de Luanda: a <strong>Centralidade do Kilamba</strong> e o <strong>Futungo de Belas</strong>.
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 text-amber-600" />
                    Centralidade do Kilamba
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Atendimento dedicado a apartamentos e vivendas nas imediações do Kilamba, além de apoio a reformas estruturais, acabamentos em gesso, instalações elétricas e ampliações residenciais.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 text-amber-600" />
                    Futungo de Belas & Talatona
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Especialistas em terrenos e lotes para construção de vivendas de luxo, condomínios unifamiliares, regularização de direito de superfície e projetos arquitetônicos contemporâneos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'servicos' && (
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-slate-950 font-heading">
                O que Fazemos pela Sua Obra ou Imóvel
              </h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                  <HardHat className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Construção Civil Chave na Mão</h4>
                    <p className="text-xs text-slate-600">Executamos toda a sua obra com fornecimento de mão de obra especializada e cotação transparente de materiais.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Building2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Venda e Arrendamento de Casas T1 a T4+</h4>
                    <p className="text-xs text-slate-600">Imóveis vistoriados previamente com checagem minuciosa de titularidade para garantir transações 100% seguras.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Fiscalização e Gestão para a Diáspora</h4>
                    <p className="text-xs text-slate-600">Clientes no exterior podem construir em Angola com segurança: fiscalizamos sua obra e enviamos relatórios fotográficos semanais.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-slate-950 font-heading">
                Segurança Jurídica e Regularização em Angola
              </h3>

              <p>
                Sabemos que adquirir terrenos ou construir em Angola exige cuidado rigoroso. Na Gemmp, nenhum lote é anunciado sem checagem de antecedentes.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-800 font-semibold p-2 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Conferência de Direito de Superfície e Certidões Matriciais</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-800 font-semibold p-2 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vistoria in loco de limites perimetrais e confrontações</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-800 font-semibold p-2 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Contratos redigidos com assessoria jurídica e reconhecimento notarial</span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Direct Box */}
          <div className="bg-slate-950 text-white p-5 rounded-2xl border-2 border-amber-500/40 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Canais Oficiais de Contato
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Telefone: {COMPANY_INFO.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span className="font-mono">{COMPANY_INFO.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{COMPANY_INFO.location}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={buildWhatsAppLink('Olá Gemmp! Gostaria de falar com o responsável sobre os serviços da empresa.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center flex items-center justify-center text-xs"
              >
                <MessageCircle className="w-4 h-4 mr-1.5 fill-white" />
                Conversar no WhatsApp
              </a>
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-center text-xs flex items-center"
              >
                Ligar Direto
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
