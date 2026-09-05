export type PropertyCategory = 
  | 'todos'
  | 'casa_t1'
  | 'casa_t2'
  | 'casa_t3'
  | 'casa_t4'
  | 'vivenda'
  | 'apartamento'
  | 'terreno_lote'
  | 'construcao_obras'
  | 'escritorio_comercial';

export type TransactionType = 'todos' | 'venda' | 'arrendamento' | 'construcao';

export type PropertyStatus = 'disponivel' | 'reservado' | 'vendido';

export interface PropertyItem {
  id: string;
  title: string;
  description: string;
  category: PropertyCategory;
  transactionType: TransactionType;
  price: number;
  currency: 'AOA' | 'USD';
  pricePeriod?: 'total' | 'mensal' | 'sob_consulta';
  isPriceOnRequest?: boolean;
  location: {
    province: string;
    cityOrDistrict: string;
    neighborhood?: string;
    referencePoint?: string;
  };
  dimensions: {
    totalAreaM2?: number;
    builtAreaM2?: number;
    lotDimensions?: string; // e.g. "20m x 30m (600m²)"
  };
  features: {
    bedrooms?: number;
    suites?: number;
    bathrooms?: number;
    parkingSpots?: number;
    kitchens?: number; // Cozinhas
    livingRooms?: number; // Salas de estar / Salas de jantar
    balconies?: number; // Varandas
    pantries?: number; // Despensas
    offices?: number; // Escritórios / Gabinetes
    otherRooms?: string; // Outros cómodos (ex: Anexo, Lavandaria, Quintal)
    hasPool?: boolean;
    hasWaterTank?: boolean;
    hasGenerator?: boolean;
    hasSecurity24h?: boolean;
    hasTitleDeed?: boolean;
    constructionStage?: 'pronto' | 'em_construcao' | 'na_planta' | 'reforma';
  };
  images: string[]; // Base64 compressed WebP or direct image URLs
  videoUrl?: string; // YouTube, MP4 or gallery video link
  isFeatured: boolean;
  status: PropertyStatus;
  createdAt: number;
  contactWhatsApp?: string;
  contactPhone?: string;
  viewsCount?: number;
}

export interface CivilConstructionService {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  deliverables: string[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'client' | 'admin';
  text: string;
  timestamp: number;
  clientName: string;
  clientPhone?: string;
  propertyId?: string;
  propertyTitle?: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  lastMessage: string;
  lastUpdated: number;
  unreadCount: number;
  propertyId?: string;
  propertyTitle?: string;
}

export interface FilterState {
  searchTerm: string;
  category: PropertyCategory;
  transactionType: TransactionType;
  cityOrDistrict: string;
  minPrice: number | null;
  maxPrice: number | null;
  minArea: number | null;
  bedrooms: number | null;
}

export interface PublicityCard {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  categoryFilter?: PropertyCategory;
  actionText: string;
  linkType?: 'category' | 'civil' | 'whatsapp';
}
