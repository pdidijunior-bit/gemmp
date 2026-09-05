import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Building2, 
  RotateCcw, 
  Tag, 
  Maximize2,
  Bed,
  Check
} from 'lucide-react';
import { CATEGORIES, TRANSACTION_TYPES, ANGOLA_LOCATIONS } from '../lib/constants';
import { getCustomCategories, getCustomLocalities } from '../lib/firebase';
import type { FilterState, PropertyCategory, TransactionType } from '../types';

interface SmartSearchProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalResults: number;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  filters,
  onFilterChange,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customCats, setCustomCats] = useState<{ value: string; label: string }[]>([]);
  const [customLocs, setCustomLocs] = useState<string[]>([]);

  useEffect(() => {
    getCustomCategories().then(setCustomCats);
    getCustomLocalities().then(setCustomLocs);

    const handleOptionsUpdate = () => {
      getCustomCategories().then(setCustomCats);
      getCustomLocalities().then(setCustomLocs);
    };
    window.addEventListener('gemmp_custom_options_updated', handleOptionsUpdate);
    return () => window.removeEventListener('gemmp_custom_options_updated', handleOptionsUpdate);
  }, []);

  const handleCategorySelect = (cat: PropertyCategory) => {
    onFilterChange({ ...filters, category: cat });
  };

  const handleTransactionSelect = (tx: TransactionType) => {
    onFilterChange({ ...filters, transactionType: tx });
  };

  const handleReset = () => {
    onFilterChange({
      searchTerm: '',
      category: 'todos',
      transactionType: 'todos',
      cityOrDistrict: '',
      minPrice: null,
      maxPrice: null,
      minArea: null,
      bedrooms: null,
    });
  };

  const isFiltered = 
    Boolean(filters.searchTerm) || 
    filters.category !== 'todos' || 
    filters.transactionType !== 'todos' || 
    Boolean(filters.cityOrDistrict) ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.minArea !== null ||
    filters.bedrooms !== null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-500/30 p-4 sm:p-6 -mt-6 sm:-mt-8 relative z-20 max-w-7xl mx-auto">
      {/* Top Search Bar with Smart Input */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch">
        
        {/* Search Input with Lupa Inteligente Icon */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-amber-600" />
          </div>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
            placeholder="O que você procura? Digite T1, T2, T3, T4, Vivenda, Lote 20x30, Kilamba, Futungo..."
            className="w-full pl-11 pr-4 py-3 bg-amber-50/40 hover:bg-amber-50/70 focus:bg-white border-2 border-amber-200 focus:border-amber-500 rounded-xl text-slate-900 font-bold placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          {filters.searchTerm && (
            <button
              onClick={() => onFilterChange({ ...filters, searchTerm: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 text-amber-600" />
          </div>
          <select
            value={filters.cityOrDistrict}
            onChange={(e) => onFilterChange({ ...filters, cityOrDistrict: e.target.value })}
            className="w-full pl-9 pr-8 py-3 bg-amber-50/40 hover:bg-amber-50/70 border-2 border-amber-200 focus:border-amber-500 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer appearance-none transition-all"
          >
            <option value="">Todas as Localidades</option>
            {customLocs.length > 0 && (
              <optgroup label="Localidades Especiais">
                {customLocs.map((loc) => (
                  <option key={loc} value={loc}>
                    ⭐ {loc}
                  </option>
                ))}
              </optgroup>
            )}
            {ANGOLA_LOCATIONS.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Transaction Type Select */}
        <div className="relative md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-4 w-4 text-amber-600" />
          </div>
          <select
            value={filters.transactionType}
            onChange={(e) => handleTransactionSelect(e.target.value as TransactionType)}
            className="w-full pl-9 pr-8 py-3 bg-amber-50/40 hover:bg-amber-50/70 border-2 border-amber-200 focus:border-amber-500 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer appearance-none transition-all"
          >
            {TRANSACTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Filter Details Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center transition-all ${
            showAdvanced || filters.minArea || filters.maxPrice || filters.bedrooms
              ? 'bg-slate-950 text-amber-400 border-slate-950'
              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2 text-amber-500" />
          Filtros Milimétricos
        </button>

        {/* Reset button if active */}
        {isFiltered && (
          <button
            onClick={handleReset}
            className="px-3 py-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs font-bold transition-all flex items-center justify-center"
            title="Limpar todos os filtros"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Limpar
          </button>
        )}
      </div>

      {/* Categories Horizontal Scroll / Pills */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center">
            <Building2 className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Categorias de Imóveis & Serviços
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full">
            {totalResults} resultado(s)
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategorySelect(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-slate-900'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 mr-1 text-slate-950 stroke-[3]" />}
                {cat.label}
              </button>
            );
          })}
          {customCats.map((cat) => {
            const isSelected = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategorySelect(cat.value as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 mr-1 text-slate-950 stroke-[3]" />}
                ⭐ {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Drawer Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-amber-200 bg-amber-50/50 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
              <Maximize2 className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Área Mínima (m²)
            </label>
            <input
              type="number"
              value={filters.minArea ?? ''}
              onChange={(e) => onFilterChange({ ...filters, minArea: e.target.value ? Number(e.target.value) : null })}
              placeholder="Ex: 200 m²"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
              <Bed className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Quartos Mínimos (T1..T4+)
            </label>
            <select
              value={filters.bedrooms ?? ''}
              onChange={(e) => onFilterChange({ ...filters, bedrooms: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="">Qualquer número de quartos</option>
              <option value="1">1 Quarto (T1)</option>
              <option value="2">2 Quartos (T2)</option>
              <option value="3">3 Quartos (T3)</option>
              <option value="4">4+ Quartos (T4 ou superior)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Preço Mínimo (Kz)
            </label>
            <input
              type="number"
              value={filters.minPrice ?? ''}
              onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : null })}
              placeholder="Ex: 5.000.000"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Preço Máximo (Kz)
            </label>
            <input
              type="number"
              value={filters.maxPrice ?? ''}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : null })}
              placeholder="Ex: 150.000.000"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
