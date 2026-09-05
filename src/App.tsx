import React, { useState, useEffect } from 'react';
import type { PropertyItem, FilterState, PropertyCategory } from './types';
import { subscribeToProperties, savePropertyToFirestore } from './lib/firebase';
import { SAMPLE_ANGOLA_PROPERTIES } from './lib/sampleData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { SmartSearch } from './components/SmartSearch';
import { PropertyList } from './components/PropertyList';
import { ConstrucaoCivilSection } from './components/ConstrucaoCivilSection';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { SobreNosModal } from './components/SobreNosModal';
import { AdminPanel } from './components/AdminPanel';
import { LiveChatWidget } from './components/LiveChatWidget';
import { Footer } from './components/Footer';

export default function App() {
  // Properties State
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    category: 'todos',
    transactionType: 'todos',
    searchTerm: '',
    cityOrDistrict: '',
    minPrice: null,
    maxPrice: null,
    minArea: null,
    bedrooms: null,
  });

  // Modals & Panels State
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<PropertyItem | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [attachedPropertyForChat, setAttachedPropertyForChat] = useState<PropertyItem | null>(null);

  // Real-time Subscription with UltraBoost instant local-cache loading
  useEffect(() => {
    const unsubscribe = subscribeToProperties((items) => {
      setProperties(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handler for category selection from Navbar or Search
  const handleSelectCategory = (category: PropertyCategory | 'todos') => {
    setFilters((prev) => ({ ...prev, category }));
    const element = document.getElementById('imoveis-listados');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler to open chat with a specific property attached
  const handleOpenChatWithProperty = (property: PropertyItem) => {
    setAttachedPropertyForChat(property);
    setIsChatOpen(true);
  };

  // Handler to open chat with a construction topic
  const handleOpenChatWithTopic = (topic: string) => {
    setIsChatOpen(true);
  };

  // Seed sample data if user wants to see demonstration
  const handleLoadSampleData = async () => {
    for (const p of SAMPLE_ANGOLA_PROPERTIES) {
      await savePropertyToFirestore(p);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. Top Navbar with Official Identity */}
      <Navbar
        onOpenSobreNos={() => setIsAboutOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={handleSelectCategory}
        ultraBoostActive={true}
        onScrollToCivil={() => {
          const el = document.getElementById('construcao-civil');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToListings={() => {
          const el = document.getElementById('imoveis-listados');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Hero Section with Announcement Banner & Chamativo Heading */}
      <main className="flex-1">
        <HeroBanner
          onOpenSobreNos={() => setIsAboutOpen(true)}
          onScrollToListings={() => {
            const el = document.getElementById('imoveis-listados');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onScrollToCivil={() => {
            const el = document.getElementById('construcao-civil');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Advanced Filter Search with T1-T4+, Lot Dimensions & Locations */}
        <SmartSearch
          filters={filters}
          onFilterChange={setFilters}
          totalResults={properties.length}
        />

        {/* 4. Real-time Listings Feed with Empty State & Demonstrations */}
        <PropertyList
          properties={properties}
          filters={filters}
          onOpenDetails={(property) => setSelectedPropertyDetails(property)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onLoadSampleData={handleLoadSampleData}
        />

        {/* 5. Civil Engineering & Construction Section */}
        <ConstrucaoCivilSection
          onOpenLiveChatWithTopic={handleOpenChatWithTopic}
        />
      </main>

      {/* 6. Footer with Official Channels & ADM Portal Link */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 7. Property Details Modal */}
      {selectedPropertyDetails && (
        <PropertyDetailModal
          property={selectedPropertyDetails}
          onClose={() => setSelectedPropertyDetails(null)}
          onOpenLiveChatWithProperty={handleOpenChatWithProperty}
        />
      )}

      {/* 8. Modern Sliding Drawer: Sobre Nós */}
      <SobreNosModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* 9. Comprehensive Admin Management Panel (Protected) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        properties={properties}
        onPropertiesUpdated={() => {}}
      />

      {/* 10. Real-time Live Assistance Chat Widget */}
      <LiveChatWidget
        isOpen={isChatOpen}
        onToggleOpen={() => setIsChatOpen((prev) => !prev)}
        attachedProperty={attachedPropertyForChat}
        onClearAttachedProperty={() => setAttachedPropertyForChat(null)}
      />

    </div>
  );
}
