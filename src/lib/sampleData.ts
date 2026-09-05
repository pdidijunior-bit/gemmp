import type { PropertyItem } from '../types';

export const SAMPLE_ANGOLA_PROPERTIES: PropertyItem[] = [
  {
    id: 'prop_demo_1',
    title: 'Vivenda T4 de Alto Padrão com Piscina no Kilamba',
    description: 'Espetacular vivenda unifamiliar moderna localizada na área nobre adjacente à Centralidade do Kilamba. Possui acabamentos de luxo, ampla sala de estar em 3 ambientes com iluminação LED embutida, cozinha americana equipada, suite master com closet e hidromassagem, e quintal espaçoso com piscina privativa e churrasqueira.',
    category: 'casa_t4',
    transactionType: 'venda',
    price: 135000000,
    currency: 'AOA',
    pricePeriod: 'total',
    location: {
      province: 'Luanda',
      cityOrDistrict: 'Kilamba (Centralidade)',
      neighborhood: 'Zona Residencial VIP',
      referencePoint: 'Próximo ao Bloco B e via principal'
    },
    dimensions: {
      totalAreaM2: 500,
      builtAreaM2: 280,
      lotDimensions: '20m x 25m (500m²)'
    },
    features: {
      bedrooms: 4,
      suites: 2,
      bathrooms: 4,
      parkingSpots: 3,
      hasPool: true,
      hasWaterTank: true,
      hasGenerator: true,
      hasSecurity24h: true,
      hasTitleDeed: true,
      constructionStage: 'pronto'
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    isFeatured: true,
    status: 'disponivel',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    viewsCount: 240
  },
  {
    id: 'prop_demo_2',
    title: 'Excelente Lote Urbano 20x30m no Futungo de Belas',
    description: 'Terreno 100% plano e murado, com dimensões privilegiadas de 20 metros de frente por 30 metros de fundo (600m²), localizado no Futungo de Belas. Documentação totalmente regularizada com Direito de Superfície e certidão matricial. Pronto para início imediato de construção de vivenda ou condomínio fechado.',
    category: 'terreno_lote',
    transactionType: 'venda',
    price: 45000000,
    currency: 'AOA',
    pricePeriod: 'total',
    location: {
      province: 'Luanda',
      cityOrDistrict: 'Futungo de Belas',
      neighborhood: 'Setor das Vivendas',
      referencePoint: 'A 4 minutos da Estrada da Samba'
    },
    dimensions: {
      totalAreaM2: 600,
      builtAreaM2: 0,
      lotDimensions: '20m x 30m = 600m²'
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      hasTitleDeed: true,
      hasSecurity24h: true,
      hasWaterTank: false,
      constructionStage: 'na_planta'
    },
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=1200&q=80'
    ],
    isFeatured: true,
    status: 'disponivel',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
    viewsCount: 310
  },
  {
    id: 'prop_demo_3',
    title: 'Vivenda T3 Moderna em Condomínio Fechado em Talatona',
    description: 'Imóvel com arquitetura contemporânea, sala de jantar e estar integradas, cozinha planejada com despensa, tanque de água de 15.000 litros com eletrobomba, e gerador de 30 kVA. Condomínio com segurança armada 24 horas, campo multiuso e salão de festas.',
    category: 'casa_t3',
    transactionType: 'arrendamento',
    price: 1800000,
    currency: 'AOA',
    pricePeriod: 'mensal',
    location: {
      province: 'Luanda',
      cityOrDistrict: 'Talatona',
      neighborhood: 'Condomínio Quinta dos Cedros',
      referencePoint: 'Próximo ao Belas Shopping'
    },
    dimensions: {
      totalAreaM2: 380,
      builtAreaM2: 210,
      lotDimensions: '15m x 25m (375m²)'
    },
    features: {
      bedrooms: 3,
      suites: 1,
      bathrooms: 3,
      parkingSpots: 2,
      hasPool: false,
      hasWaterTank: true,
      hasGenerator: true,
      hasSecurity24h: true,
      hasTitleDeed: true,
      constructionStage: 'pronto'
    },
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    isFeatured: false,
    status: 'disponivel',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    viewsCount: 180
  }
];
