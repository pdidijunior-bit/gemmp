import type { PropertyCategory, TransactionType } from '../types';

export const COMPANY_INFO = {
  name: 'Gemmp Construção Civil & Imobiliária',
  shortName: 'GEMMP',
  slogan: 'Excelência em Construção Civil e Mediação Imobiliária',
  phone: '+244 935973494',
  phoneRaw: '+244935973494',
  whatsapp: '+244 935973494',
  whatsappRaw: '244935973494',
  email: 'gemmpeimoveis93221@gmail.com',
  location: 'Kilamba, Futungo de Belas - Luanda, Angola',
  hours: 'Segunda a Sábado: 08h00 às 18h00 | Domingo: Plantão de Atendimento',
};

export const CATEGORIES: { value: PropertyCategory; label: string; icon: string }[] = [
  { value: 'todos', label: 'Todas as Opções', icon: 'LayoutGrid' },
  { value: 'casa_t1', label: 'Casas T1', icon: 'Home' },
  { value: 'casa_t2', label: 'Casas T2', icon: 'Home' },
  { value: 'casa_t3', label: 'Casas T3', icon: 'Home' },
  { value: 'casa_t4', label: 'Casas T4+', icon: 'Home' },
  { value: 'vivenda', label: 'Vivendas de Alto Padrão', icon: 'Castle' },
  { value: 'apartamento', label: 'Apartamentos', icon: 'Building2' },
  { value: 'terreno_lote', label: 'Terrenos & Lotes', icon: 'Map' },
  { value: 'construcao_obras', label: 'Obras & Engenharia', icon: 'HardHat' },
  { value: 'escritorio_comercial', label: 'Comercial & Escritórios', icon: 'Briefcase' },
];

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'todos', label: 'Todos os Tipos' },
  { value: 'venda', label: 'Para Venda' },
  { value: 'arrendamento', label: 'Para Arrendamento' },
  { value: 'construcao', label: 'Construção & Projeto' },
];

export const ANGOLA_LOCATIONS = [
  { group: 'Luanda - Distritos & Centralidades', cities: [
    'Kilamba (Centralidade)',
    'Futungo de Belas',
    'Talatona',
    'Benfica',
    'Camama',
    'Maianga',
    'Viana',
    'Belas',
    'Alvalade',
    'Miramar',
    'Mutamba / Ingombota',
    'Sequele (Centralidade)',
    'Nova Vida',
    'Morro Bento',
    'Cacuaco',
    'Cazenga',
    'Samba',
    'Maculusso',
    'Zango',
    'Ilha de Luanda'
  ]},
  { group: 'Outras Províncias', cities: [
    'Benguela (Centro / Lobito / Baía Farta)',
    'Malanje (Centro / Catepa)',
    'Huíla (Lubango / Humpata)',
    'Huambo (Centro / Caála)',
    'Cabinda',
    'Cuanza Sul (Sumbe / Porto Amboim)',
    'Namibe',
    'Uíge',
    'Zaire (Soyo / Mbanza Kongo)'
  ]}
];

export const CIVIL_CONSTRUCTION_SERVICES = [
  {
    id: 'construcao_residencial',
    title: 'Construção de Vivendas Chave na Mão',
    shortDesc: 'Do alicerce aos acabamentos de luxo, entregamos sua residência pronta para morar com garantia estrutural.',
    fullDesc: 'Execução integral de obras residenciais de médio e alto padrão no Kilamba, Futungo de Belas, Talatona e Luanda. Equipe qualificada de engenheiros, mestres de obras e arquitetos.',
    icon: 'Building',
    deliverables: [
      'Fundações e estrutura armada reforçada',
      'Instalações elétricas, hidráulicas e climatização',
      'Acabamentos premium (porcelanatos, gesso cartonado, vidraçaria)',
      'Tanques subterrâneos de água e sistemas de gerador'
    ]
  },
  {
    id: 'projetos_arquitetura',
    title: 'Projetos de Arquitetura & Engenharia',
    shortDesc: 'Projetos 3D realistas, plantas arquitetônicas, cálculo estrutural e aprovações legais.',
    fullDesc: 'Desenvolvimento técnico de excelência com visualização foto-realista para você ver sua obra antes mesmo de iniciar a fundação.',
    icon: 'Compass',
    deliverables: [
      'Plantas baixas executivas e cortes',
      'Maquetes eletrônicas 3D e renderizações fotorrealistas',
      'Projetos de estabilidade, águas e esgotos',
      'Memoriais descritivos e orçamentos detalhados'
    ]
  },
  {
    id: 'reformas_acabamentos',
    title: 'Remodelações & Acabamentos de Alto Padrão',
    shortDesc: 'Modernização de casas antigas, ampliação de divisões, piscinas e áreas de lazer.',
    fullDesc: 'Transformamos seu espaço com revestimentos modernos, iluminação LED embutida, tetos falsos e pintura impermeabilizada de alta durabilidade.',
    icon: 'Wrench',
    deliverables: [
      'Construção de anexos e áreas gourmet',
      'Instalação e impermeabilização de piscinas',
      'Revestimentos cerâmicos e porcelanato polido',
      'Pinturas decorativas e isolamento térmico/acústico'
    ]
  },
  {
    id: 'fiscalizacao_obras',
    title: 'Fiscalização e Gestão de Obras',
    shortDesc: 'Acompanhamento rigoroso de obras para assegurar cumprimento de prazos, custos e qualidade.',
    fullDesc: 'Para quem está na diáspora ou sem tempo: a Gemmp audita a compra de materiais, o progresso diário da equipe e emite relatórios semanais com fotos e vídeos.',
    icon: 'ShieldCheck',
    deliverables: [
      'Auditoria de orçamentos e cotação de materiais em Luanda',
      'Vistorias técnicas presenciais',
      'Relatórios semanais com medições e filmagens',
      'Controle rigoroso contra desperdício de cimento e ferro'
    ]
  }
];

export function buildWhatsAppLink(text?: string): string {
  const base = `https://wa.me/${COMPANY_INFO.whatsappRaw}`;
  if (!text) {
    return `${base}?text=${encodeURIComponent('Olá Gemmp Construção Civil & Imobiliária! Gostaria de obter mais informações sobre os vossos serviços e imóveis disponíveis.')}`;
  }
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function buildPropertyWhatsAppLink(title: string, price: string, location: string): string {
  const message = `Olá Gemmp Construção Civil & Imobiliária!\nTenho interesse no imóvel anunciado:\n📌 *${title}*\n📍 Localização: *${location}*\n💰 Valor: *${price}*\n\nPoderiam me enviar mais detalhes e agendar uma visita?`;
  return buildWhatsAppLink(message);
}

export function formatPriceAOA(amount: number, currency = 'AOA'): string {
  if (!amount || amount === 0) return 'Sob Consulta';
  const formatted = new Intl.NumberFormat('pt-AO', {
    maximumFractionDigits: 0,
  }).format(amount);
  return currency === 'USD' ? `$ ${formatted}` : `${formatted} Kz`;
}

export const DEFAULT_PUBLICITY_CARDS = [
  {
    id: 'pub_1',
    title: 'Vivendas de Alto Padrão',
    subtitle: 'Kilamba & Futungo de Belas • Prontas a Habitar e Acabamentos de Luxo',
    badge: 'OPORTUNIDADE EXCLUSIVA',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    categoryFilter: 'vivenda' as PropertyCategory,
    actionText: 'Ver Vivendas',
    linkType: 'category' as const,
  },
  {
    id: 'pub_2',
    title: 'Terrenos & Lotes 20x30m',
    subtitle: 'Com Direito de Superfície e Toda Documentação Regularizada',
    badge: 'DOCUMENTAÇÃO 100% SEGURA',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    categoryFilter: 'terreno_lote' as PropertyCategory,
    actionText: 'Ver Lotes',
    linkType: 'category' as const,
  },
  {
    id: 'pub_3',
    title: 'Construção Civil Chave na Mão',
    subtitle: 'Engenharia, Projetos 3D e Execução Rigorosa do Alicerce ao Teto',
    badge: 'OBRA COM GARANTIA',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    actionText: 'Solicitar Orçamento',
    linkType: 'civil' as const,
  },
];
