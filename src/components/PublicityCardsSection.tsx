import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, MapPin, CheckCircle } from 'lucide-react';
import type { PublicityCard, PropertyCategory } from '../types';
import { getPublicityCards } from '../lib/firebase';
import { DEFAULT_PUBLICITY_CARDS, buildWhatsAppLink } from '../lib/constants';

interface PublicityCardsSectionProps {
  onSelectCategory: (category: PropertyCategory) => void;
  onScrollToCivil: () => void;
  onScrollToListings: () => void;
}

export const PublicityCardsSection: React.FC<PublicityCardsSectionProps> = ({
  onSelectCategory,
  onScrollToCivil,
  onScrollToListings,
}) => {
  const [cards, setCards] = useState<PublicityCard[]>(DEFAULT_PUBLICITY_CARDS);

  useEffect(() => {
    getPublicityCards().then((res) => {
      if (res && res.length) setCards(res);
    });

    const handleUpdate = (e: any) => {
      if (e.detail?.cards) {
        setCards(e.detail.cards);
      }
    };

    window.addEventListener('gemmp_publicity_updated', handleUpdate);
    return () => window.removeEventListener('gemmp_publicity_updated', handleUpdate);
  }, []);

  const handleCardClick = (card: PublicityCard) => {
    if (card.linkType === 'civil') {
      onScrollToCivil();
    } else if (card.linkType === 'whatsapp') {
      window.open(buildWhatsAppLink(`Olá Gemmp! Gostaria de mais informações sobre: ${card.title}`), '_blank');
    } else if (card.categoryFilter) {
      onSelectCategory(card.categoryFilter);
      onScrollToListings();
    } else {
      onScrollToListings();
    }
  };

  return (
    <section className="relative -mt-6 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 mb-8">
      {/* 3 Horizontal Publicity Boxes / Caixinhas de Publicidade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card, idx) => (
          <div
            key={card.id || idx}
            id={`publicity-card-${card.id || idx}`}
            onClick={() => handleCardClick(card)}
            className="group relative rounded-2xl overflow-hidden bg-white border-2 border-amber-400/40 hover:border-amber-500 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col"
          >
            {/* Image Container with realistic villa preview */}
            <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Badge Tag */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black bg-amber-500 text-slate-950 shadow-md uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 mr-1 fill-slate-950" />
                  {card.badge}
                </span>
              </div>

              {/* Verified Security Tag */}
              <div className="absolute bottom-2.5 left-3 flex items-center space-x-1 text-[11px] font-bold text-amber-300 drop-shadow">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 fill-amber-400 text-slate-950" />
                <span>Gemmp Oficial • Kilamba & Futungo</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors font-heading leading-snug mb-1.5">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {card.subtitle}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-amber-600 group-hover:text-amber-700 flex items-center">
                  {card.actionText || 'Ver Oportunidade'}
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Acesso Imediato
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
