import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  Car, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  Video,
  Building,
  Calendar,
  Waves,
  Zap,
  Droplets,
  Share2,
  UtensilsCrossed,
  Sofa,
  Wind,
  Archive,
  Briefcase,
  Home
} from 'lucide-react';
import type { PropertyItem } from '../types';
import { formatPriceAOA, buildPropertyWhatsAppLink, COMPANY_INFO } from '../lib/constants';

interface PropertyDetailModalProps {
  property: PropertyItem | null;
  onClose: () => void;
  onOpenLiveChatWithProperty: (property: PropertyItem) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onOpenLiveChatWithProperty,
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const images = property.images?.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const formattedPrice = property.isPriceOnRequest 
    ? 'Sob Consulta' 
    : formatPriceAOA(property.price, property.currency) + (property.pricePeriod === 'mensal' ? ' / mês' : '');

  const locationFull = `${property.location.cityOrDistrict}${property.location.neighborhood ? ` (${property.location.neighborhood})` : ''}, ${property.location.province}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Confira este imóvel na Gemmp Construção Civil & Imobiliária: ${property.title} por ${formattedPrice}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border-2 border-amber-500 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="bg-slate-950 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b-2 border-amber-500 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-md uppercase">
              {property.transactionType === 'arrendamento' ? 'Arrendamento' : 'Venda'}
            </span>
            <span className="text-xs text-amber-300 font-bold hidden sm:inline">
              Ref: {property.id.substring(0, 10)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {copied && (
              <span className="text-[11px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded animate-pulse">
                Link copiado!
              </span>
            )}

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-400 text-xs flex items-center"
              title="Partilhar Imóvel"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Photo Gallery */}
          <div className="space-y-2">
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
              <img
                src={images[activeImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-white font-bold text-xs">
                Foto {activeImageIndex + 1} de {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-amber-500 scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Video Player if provided */}
          {property.videoUrl && (
            <div className="bg-slate-950 rounded-2xl p-4 border border-amber-500/30">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold mb-2">
                <Video className="w-4 h-4" />
                <span>Vídeo Apresentação do Imóvel</span>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                {property.videoUrl.includes('youtube.com') || property.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={property.videoUrl.replace('watch?v=', 'embed/')}
                    title="Vídeo do imóvel"
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video src={property.videoUrl} controls className="w-full h-full object-contain" />
                )}
              </div>
            </div>
          )}

          {/* Title, Location & Price */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center text-xs font-bold text-amber-700">
                <MapPin className="w-4 h-4 mr-1 text-amber-600" />
                {locationFull}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                {property.title}
              </h2>
              {property.location.referencePoint && (
                <p className="text-xs text-slate-500">
                  Ponto de Referência: {property.location.referencePoint}
                </p>
              )}
            </div>

            <div className="bg-amber-500/10 border-2 border-amber-500/40 p-3.5 rounded-2xl text-left sm:text-right shrink-0">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Valor Solicitado
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 font-heading">
                {formattedPrice}
              </div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center sm:justify-end mt-0.5">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Negociação Direta com Gemmp
              </span>
            </div>
          </div>

          {/* Dimensional Specs Table */}
          <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/60">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center">
              <Maximize2 className="w-4 h-4 mr-1.5 text-amber-600" />
              Dimensões e Medidas do Imóvel / Terreno
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-amber-100">
                <span className="text-[10px] text-slate-500 font-semibold block">Dimensões do Terreno:</span>
                <span className="text-sm font-black text-slate-900">
                  {property.dimensions?.lotDimensions || 'Conforme Planta'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-100">
                <span className="text-[10px] text-slate-500 font-semibold block">Área Total:</span>
                <span className="text-sm font-black text-slate-900">
                  {property.dimensions?.totalAreaM2 ? `${property.dimensions.totalAreaM2} m²` : 'N/A'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-100">
                <span className="text-[10px] text-slate-500 font-semibold block">Área Construída:</span>
                <span className="text-sm font-black text-slate-900">
                  {property.dimensions?.builtAreaM2 ? `${property.dimensions.builtAreaM2} m²` : 'N/A'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-100">
                <span className="text-[10px] text-slate-500 font-semibold block">Situação Jurídica:</span>
                <span className="text-sm font-black text-emerald-700 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  {property.features?.hasTitleDeed ? 'Superfície / Titulado' : 'Em Regularização'}
                </span>
              </div>
            </div>
          </div>

          {/* Features Badges */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Comodidades e Infraestrutura
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs font-semibold text-slate-700">
              {property.features?.bedrooms ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Bed className="w-4 h-4 mr-2 text-amber-600" />
                  <span>{property.features.bedrooms} Quartos {property.features.suites ? `(${property.features.suites} Suítes)` : ''}</span>
                </div>
              ) : null}
              {property.features?.bathrooms ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Bath className="w-4 h-4 mr-2 text-amber-600" />
                  <span>{property.features.bathrooms} Casas de Banho</span>
                </div>
              ) : null}
              {property.features?.kitchens ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <UtensilsCrossed className="w-4 h-4 mr-2 text-amber-600" />
                  <span>{property.features.kitchens} Cozinha(s)</span>
                </div>
              ) : null}
              {property.features?.livingRooms ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Sofa className="w-4 h-4 mr-2 text-amber-600" />
                  <span>{property.features.livingRooms} Sala(s) Estar/Jantar</span>
                </div>
              ) : null}
              {property.features?.balconies ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Wind className="w-4 h-4 mr-2 text-amber-600" />
                  <span>{property.features.balconies} Varanda(s)</span>
                </div>
              ) : null}
              {property.features?.pantries ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Archive className="w-4 h-4 mr-2 text-amber-600" />
                  <span>{property.features.pantries} Despensa(s)</span>
                </div>
              ) : null}
              {property.features?.offices ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Briefcase className="w-4 h-4 mr-2 text-amber-600" />
                  <span>{property.features.offices} Gabinete / Escritório</span>
                </div>
              ) : null}
              {property.features?.parkingSpots ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Car className="w-4 h-4 mr-2 text-amber-600" />
                  <span>{property.features.parkingSpots} Vagas Garagem</span>
                </div>
              ) : null}
              {property.features?.hasPool ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Waves className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Piscina Privativa</span>
                </div>
              ) : null}
              {property.features?.hasWaterTank ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Droplets className="w-4 h-4 mr-2 text-sky-600" />
                  <span>Tanque de Água</span>
                </div>
              ) : null}
              {property.features?.hasGenerator ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Zap className="w-4 h-4 mr-2 text-amber-600" />
                  <span>Suporte a Gerador</span>
                </div>
              ) : null}
              {property.features?.hasSecurity24h ? (
                <div className="flex items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
                  <span>Segurança 24 Horas</span>
                </div>
              ) : null}
              {property.features?.otherRooms ? (
                <div className="flex items-center p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 sm:col-span-2">
                  <Home className="w-4 h-4 mr-2 text-amber-600" />
                  <span>Mais Cómodos: {property.features.otherRooms}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Descrição Completa do Imóvel
            </h4>
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {property.description}
            </div>
          </div>

        </div>

        {/* Modal Bottom Fixed CTA Actions */}
        <div className="bg-slate-950 p-4 sm:p-5 border-t-2 border-amber-500 shrink-0 flex flex-wrap gap-3 items-center justify-between">
          <div className="text-xs text-slate-300">
            <span className="text-slate-400 block">Dúvidas ou agendamento de visita?</span>
            <span className="font-bold text-amber-400">Atendimento Gemmp no Kilamba & Futungo</span>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <a
              href={buildPropertyWhatsAppLink(property.title, formattedPrice, locationFull)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow"
            >
              <MessageCircle className="w-4 h-4 mr-1.5 fill-white" />
              WhatsApp Imediato
            </a>

            <button
              onClick={() => {
                onClose();
                onOpenLiveChatWithProperty(property);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Chat ao Vivo no Site
            </button>

            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center"
            >
              <Phone className="w-4 h-4 mr-1 text-amber-400" />
              Ligar
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
