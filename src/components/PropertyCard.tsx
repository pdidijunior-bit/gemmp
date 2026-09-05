import React from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  MessageCircle, 
  Phone, 
  Video, 
  Eye, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import type { PropertyItem } from '../types';
import { formatPriceAOA, buildPropertyWhatsAppLink, COMPANY_INFO } from '../lib/constants';

interface PropertyCardProps {
  property: PropertyItem;
  onOpenDetails: (property: PropertyItem) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onOpenDetails,
}) => {
  const primaryImage = property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
  const formattedPrice = property.isPriceOnRequest 
    ? 'Sob Consulta' 
    : formatPriceAOA(property.price, property.currency) + (property.pricePeriod === 'mensal' ? ' / mês' : '');

  const getStatusBadge = () => {
    switch (property.status) {
      case 'disponivel':
        return <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm">Disponível</span>;
      case 'reservado':
        return <span className="bg-amber-600 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm">Reservado</span>;
      case 'vendido':
        return <span className="bg-slate-800 text-slate-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm">Vendido</span>;
      default:
        return null;
    }
  };

  const getCategoryLabel = () => {
    switch (property.category) {
      case 'casa_t1': return 'Casa T1';
      case 'casa_t2': return 'Casa T2';
      case 'casa_t3': return 'Casa T3';
      case 'casa_t4': return 'Casa T4+';
      case 'vivenda': return 'Vivenda VIP';
      case 'terreno_lote': return 'Terreno / Lote';
      case 'apartamento': return 'Apartamento';
      case 'construcao_obras': return 'Construção Civil';
      case 'escritorio_comercial': return 'Comercial';
      default: return 'Imóvel';
    }
  };

  const locationText = `${property.location.cityOrDistrict}${property.location.neighborhood ? ` (${property.location.neighborhood})` : ''}, ${property.location.province}`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border-2 border-slate-100 hover:border-amber-400/80 transition-all duration-300 flex flex-col group">
      
      {/* Image Container with Badges */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onOpenDetails(property)}>
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {getStatusBadge()}
          <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm">
            {getCategoryLabel()}
          </span>
          {property.transactionType === 'arrendamento' && (
            <span className="bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2 py-1 rounded-md shadow-sm">
              Arrendamento
            </span>
          )}
        </div>

        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 z-10">
          {property.videoUrl && (
            <span className="bg-rose-600 text-white p-1 rounded-md text-[10px] font-bold flex items-center shadow" title="Possui vídeo">
              <Video className="w-3.5 h-3.5" />
            </span>
          )}
          {property.images.length > 1 && (
            <span className="bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[11px] font-bold">
              📷 {property.images.length}
            </span>
          )}
        </div>

        {/* Bottom Price on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between z-10">
          <div>
            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
              {property.transactionType === 'arrendamento' ? 'Valor da Renda' : 'Preço de Venda'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-heading drop-shadow-md">
              {formattedPrice}
            </div>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Location */}
          <div className="flex items-center text-xs font-semibold text-slate-600 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600 mr-1 shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetails(property)}
            className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-amber-600 line-clamp-2 leading-snug cursor-pointer font-heading"
          >
            {property.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Dimensional and Feature Specs */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-700 bg-amber-50/40 rounded-xl p-2.5">
          
          {/* Dimensional Measure */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center font-bold text-slate-900 text-xs">
              <Maximize2 className="w-3.5 h-3.5 mr-1 text-amber-600" />
              {property.dimensions?.lotDimensions 
                ? property.dimensions.lotDimensions.split('(')[0].trim() 
                : property.dimensions?.totalAreaM2 
                  ? `${property.dimensions.totalAreaM2} m²` 
                  : 'Dimensões'}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Área / Medidas</span>
          </div>

          {/* Bedrooms / Category Detail */}
          <div className="flex flex-col items-center justify-center border-x border-amber-200/60">
            <div className="flex items-center font-bold text-slate-900 text-xs">
              <Bed className="w-3.5 h-3.5 mr-1 text-amber-600" />
              {property.features?.bedrooms ? `${property.features.bedrooms} Qts` : (property.category === 'terreno_lote' ? 'Terreno' : 'N/A')}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Quartos</span>
          </div>

          {/* Legal / Doc status */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center font-bold text-slate-900 text-xs text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              {property.features?.hasTitleDeed ? 'Superfície' : 'Legalizado'}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Documentos</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <a
            href={buildPropertyWhatsAppLink(property.title, formattedPrice, locationText)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow transition-colors"
          >
            <MessageCircle className="w-4 h-4 mr-1.5 fill-white" />
            WhatsApp
          </a>

          <button
            onClick={() => onOpenDetails(property)}
            className="py-2.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center shadow transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 mr-1" />
            Detalhes
          </button>
        </div>

      </div>
    </div>
  );
};
