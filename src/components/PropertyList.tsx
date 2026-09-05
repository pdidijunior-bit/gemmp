import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Filter, 
  ArrowUpDown, 
  PlusCircle, 
  Inbox,
  Flame
} from 'lucide-react';
import type { PropertyItem, FilterState } from '../types';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  properties: PropertyItem[];
  filters: FilterState;
  onOpenDetails: (property: PropertyItem) => void;
  onLoadSampleData?: () => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  filters,
  onOpenDetails,
  onLoadSampleData,
}) => {
  const [sortBy, setSortBy] = useState<'recente' | 'preco_menor' | 'preco_maior' | 'area'>('recente');

  // Filter properties based on FilterState
  const filtered = properties.filter((item) => {
    // Search term check
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(term);
      const matchDesc = item.description.toLowerCase().includes(term);
      const matchLoc = (item.location.cityOrDistrict + ' ' + (item.location.neighborhood || '')).toLowerCase().includes(term);
      const matchCat = item.category.toLowerCase().includes(term);
      const matchDims = (item.dimensions?.lotDimensions || '').toLowerCase().includes(term);
      if (!matchTitle && !matchDesc && !matchLoc && !matchCat && !matchDims) {
        return false;
      }
    }

    // Category filter
    if (filters.category !== 'todos' && item.category !== filters.category) {
      return false;
    }

    // Transaction type
    if (filters.transactionType !== 'todos' && item.transactionType !== filters.transactionType) {
      return false;
    }

    // City/District
    if (filters.cityOrDistrict && item.location.cityOrDistrict !== filters.cityOrDistrict) {
      return false;
    }

    // Min Price
    if (filters.minPrice !== null && item.price < filters.minPrice) {
      return false;
    }

    // Max Price
    if (filters.maxPrice !== null && item.price > filters.maxPrice) {
      return false;
    }

    // Min Area
    if (filters.minArea !== null && (item.dimensions?.totalAreaM2 || 0) < filters.minArea) {
      return false;
    }

    // Bedrooms
    if (filters.bedrooms !== null) {
      if ((item.features?.bedrooms || 0) < filters.bedrooms) {
        return false;
      }
    }

    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'preco_menor') return a.price - b.price;
    if (sortBy === 'preco_maior') return b.price - a.price;
    if (sortBy === 'area') return (b.dimensions?.totalAreaM2 || 0) - (a.dimensions?.totalAreaM2 || 0);
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  return (
    <section id="imoveis-listados" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header of Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b-2 border-amber-500/20 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 text-xs font-black tracking-wider uppercase mb-1">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Actualizados em Tempo Real pelos Administradores</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading">
            Lotes e Imóveis Recentes no Kilamba, Futungo & Luanda
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Selecione entre casas prontas a habitar, vivendas em construção, terrenos regularizados e opções comerciais.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Ordenar por:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="recente">Mais Recentes</option>
            <option value="preco_menor">Menor Preço</option>
            <option value="preco_maior">Maior Preço</option>
            <option value="area">Maior Área (m²)</option>
          </select>
        </div>
      </div>

      {/* When Empty (respecting "não incluam dados artificiais no site deixa ele vago para que eu possa apresentar para a imobiliária") */}
      {sorted.length === 0 ? (
        <div className="bg-amber-500/5 border-2 border-dashed border-amber-300 rounded-3xl p-8 sm:p-14 text-center max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 font-heading">
            Nenhum imóvel ou lote listado no momento
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
            O catálogo da <strong>Gemmp Construção Civil & Imobiliária</strong> está conectado em tempo real ao Firestore. 
            Você pode acessar o Painel de Administração para publicar os primeiros anúncios reais de imóveis ou terrenos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/244935973494?text=Ol%C3%A1%20Gemmp!%20Gostaria%20de%20consultar%20im%C3%B3veis%20e%20lotes%20dispon%C3%ADveis."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center"
            >
              Consultar Disponibilidade no WhatsApp
            </a>

            {onLoadSampleData && (
              <button
                onClick={onLoadSampleData}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow transition-all flex items-center"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Carregar 3 Exemplos Reais (Demonstração)
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Property Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sorted.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
};
