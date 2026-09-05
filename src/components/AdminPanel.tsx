import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  PlusCircle, 
  Building2, 
  MessageSquare, 
  ShieldCheck, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Camera, 
  Video, 
  Maximize2, 
  MapPin, 
  Tag, 
  Send,
  Zap,
  RefreshCw,
  LogOut,
  LayoutGrid,
  Plus,
  Home,
  Cloud,
  CloudOff,
  Copy,
  ExternalLink
} from 'lucide-react';
import type { PropertyItem, PropertyCategory, TransactionType, PropertyStatus, Conversation, ChatMessage, PublicityCard } from '../types';
import { 
  savePropertyToFirestore, 
  deletePropertyFromFirestore, 
  subscribeToConversations, 
  subscribeToMessages, 
  sendChatMessage, 
  markConversationAsRead,
  exportEncryptedBackup,
  restoreEncryptedBackup,
  getUltraBoostStatus,
  setUltraBoostStatus,
  getPublicityCards,
  savePublicityCards,
  getCustomCategories,
  saveCustomCategory,
  getCustomLocalities,
  saveCustomLocality,
  checkFirestoreConnectivity,
  auth
} from '../lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { compressImageFile } from '../lib/imageCompressor';
import { CATEGORIES, TRANSACTION_TYPES, ANGOLA_LOCATIONS, formatPriceAOA } from '../lib/constants';
import { SAMPLE_ANGOLA_PROPERTIES } from '../lib/sampleData';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  properties: PropertyItem[];
  onPropertiesUpdated: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  properties,
  onPropertiesUpdated,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('gemmp_adm_authenticated') === 'true';
  });
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Admin Navigation Tabs
  const [activeTab, setActiveTab] = useState<'publicar' | 'imoveis' | 'publicidade' | 'conversas' | 'backup' | 'apresentacao' | 'firebase'>('publicar');

  // Firestore Real-Time Connectivity Status
  const [connectivityStatus, setConnectivityStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [connectivityError, setConnectivityError] = useState('');
  const [copiedRules, setCopiedRules] = useState(false);

  const runConnectivityTest = async () => {
    setConnectivityStatus('checking');
    try {
      const res = await checkFirestoreConnectivity();
      if (res.connected) {
        setConnectivityStatus('connected');
        setConnectivityError('');
      } else {
        setConnectivityStatus('error');
        setConnectivityError(res.error || 'Permissão negada');
      }
    } catch (e: any) {
      setConnectivityStatus('error');
      setConnectivityError(e?.message || 'Falha de conexão');
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      runConnectivityTest();
    }
  }, [isOpen, isAuthenticated]);

  // Publicity Cards (Caixinhas de Publicidade)
  const [publicityCards, setPublicityCards] = useState<PublicityCard[]>([]);
  const [isSavingPublicity, setIsSavingPublicity] = useState(false);
  const [publicityStatusMessage, setPublicityStatusMessage] = useState('');

  // Form State for Publishing / Editing
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<PropertyCategory>('casa_t3');
  const [formTransaction, setFormTransaction] = useState<TransactionType>('venda');
  const [formPrice, setFormPrice] = useState<number | ''>('');
  const [formCurrency, setFormCurrency] = useState<'AOA' | 'USD'>('AOA');
  const [formPricePeriod, setFormPricePeriod] = useState<'total' | 'mensal' | 'sob_consulta'>('total');
  const [formIsPriceOnRequest, setFormIsPriceOnRequest] = useState(false);

  // Location
  const [formProvince, setFormProvince] = useState('Luanda');
  const [formCity, setFormCity] = useState('Kilamba (Centralidade)');
  const [formNeighborhood, setFormNeighborhood] = useState('');
  const [formReferencePoint, setFormReferencePoint] = useState('');

  // Dimensions
  const [formLotDimensions, setFormLotDimensions] = useState('20m x 30m (600m²)');
  const [formTotalArea, setFormTotalArea] = useState<number | ''>('');
  const [formBuiltArea, setFormBuiltArea] = useState<number | ''>('');

  // Features & Rooms
  const [formBedrooms, setFormBedrooms] = useState<number | ''>(3);
  const [formSuites, setFormSuites] = useState<number | ''>(1);
  const [formBathrooms, setFormBathrooms] = useState<number | ''>(2);
  const [formKitchens, setFormKitchens] = useState<number | ''>(1);
  const [formLivingRooms, setFormLivingRooms] = useState<number | ''>(1);
  const [formBalconies, setFormBalconies] = useState<number | ''>('');
  const [formPantries, setFormPantries] = useState<number | ''>('');
  const [formOffices, setFormOffices] = useState<number | ''>('');
  const [formOtherRooms, setFormOtherRooms] = useState('');
  const [formParking, setFormParking] = useState<number | ''>(2);
  const [formHasPool, setFormHasPool] = useState(false);
  const [formHasWaterTank, setFormHasWaterTank] = useState(true);
  const [formHasGenerator, setFormHasGenerator] = useState(false);
  const [formHasSecurity, setFormHasSecurity] = useState(true);
  const [formHasTitleDeed, setFormHasTitleDeed] = useState(true);

  // Dynamic Categories & Localities added by ADM
  const [customCategories, setCustomCategories] = useState<{ value: string; label: string }[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [customLocalities, setCustomLocalities] = useState<string[]>([]);
  const [newLocalityInput, setNewLocalityInput] = useState('');
  const [isAddingLocality, setIsAddingLocality] = useState(false);

  // Media
  const [formImages, setFormImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Client Conversations State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Backup & Restore state
  const [backupKey, setBackupKey] = useState('GEMMP-ANGOLA-SECURE-KEY-2026');
  const [backupPayload, setBackupPayload] = useState('');
  const [restorePayload, setRestorePayload] = useState('');
  const [backupMessage, setBackupMessage] = useState('');

  // UltraBoost toggle
  const [ultraBoostState, setUltraBoostState] = useState(getUltraBoostStatus());

  // Listen to conversations when tab is active
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsub = subscribeToConversations((convs) => {
      setConversations(convs);
      if (!selectedConversationId && convs.length > 0) {
        setSelectedConversationId(convs[0].id);
      }
    });
    return () => unsub();
  }, [isAuthenticated]);

  // Listen to messages of selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;
    markConversationAsRead(selectedConversationId);
    const unsub = subscribeToMessages(selectedConversationId, (msgs) => {
      setActiveMessages(msgs);
    });
    return () => unsub();
  }, [selectedConversationId]);

  // Load Publicity Cards when opened
  useEffect(() => {
    if (isOpen) {
      getPublicityCards().then(setPublicityCards);
      getCustomCategories().then(setCustomCategories);
      getCustomLocalities().then(setCustomLocalities);
    }
    const handleOptionsUpdate = () => {
      getCustomCategories().then(setCustomCategories);
      getCustomLocalities().then(setCustomLocalities);
    };
    window.addEventListener('gemmp_custom_options_updated', handleOptionsUpdate);
    return () => window.removeEventListener('gemmp_custom_options_updated', handleOptionsUpdate);
  }, [isOpen]);

  const handleSavePublicityCards = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPublicity(true);
    setPublicityStatusMessage('');
    try {
      await savePublicityCards(publicityCards);
      setPublicityStatusMessage('Caixas de publicidade atualizadas no site com sucesso!');
    } catch {
      setPublicityStatusMessage('Erro ao salvar alterações de publicidade.');
    } finally {
      setIsSavingPublicity(false);
    }
  };

  const handleUpdateCardField = (index: number, field: keyof PublicityCard, value: string) => {
    const updated = [...publicityCards];
    updated[index] = { ...updated[index], [field]: value };
    setPublicityCards(updated);
  };

  if (!isOpen) return null;

  // Helper to hash credentials without exposing plaintext in bundle
  const computeHash = async (text: string) => {
    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return '';
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const emailClean = emailInput.trim().toLowerCase();
    const passClean = passwordInput.trim();

    // Primary: Authenticate securely via Firebase Auth
    let fbSuccess = false;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailClean, passClean);
      if (userCredential?.user) {
        fbSuccess = true;
      }
    } catch (fbErr: any) {
      console.warn('Firebase Auth notice:', fbErr?.code || fbErr?.message);
    }

    // Secondary: Secure hashed verification for environment-configured admin
    const expectedEmail = ((import.meta as any).env?.VITE_ADMIN_EMAIL || 'gemmpeimoveis93221@gmail.com').toLowerCase();
    const envPass = (import.meta as any).env?.VITE_ADMIN_PASSWORD;
    const inputHash = await computeHash(passClean);
    // SHA-256 hash of authorized administrative passkey
    const validHashes = [
      'c63a24ff9abd11f01f8669cbbe867b95bb306f37fc83b27b7873828ae44febec',
      '75d9475c404da645c386221c57173e4497e704077bf18b321a0f8fc7b6b194fb'
    ];

    const isHashOrEnvAdmin = (emailClean === expectedEmail) && (
      (envPass && passClean === envPass) || validHashes.includes(inputHash)
    );

    if (fbSuccess || isHashOrEnvAdmin || auth.currentUser) {
      setIsAuthenticated(true);
      localStorage.setItem('gemmp_adm_authenticated', 'true');
      setAuthError('');
    } else {
      setAuthError('E-mail ou palavra-passe incorretos. Acesso restrito à Gemmp.');
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    signOut(auth).catch(() => {});
    setIsAuthenticated(false);
    localStorage.removeItem('gemmp_adm_authenticated');
  };

  // Image Upload with Canvas Ultra-Compression (NO Firebase Storage Fee Needed!)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressingImage(true);
    const newImages = [...formImages];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Compresses client-side using Canvas to ultra-lightweight WebP
        const compressedBase64 = await compressImageFile(file, 1200, 900, 0.72);
        newImages.push(compressedBase64);
      }
      setFormImages(newImages);
    } catch (err) {
      alert('Erro ao comprimir imagem. Tente novamente.');
    } finally {
      setIsCompressingImage(false);
    }
  };

  const handleAddExternalImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setFormImages([...formImages, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(formImages.filter((_, idx) => idx !== index));
  };

  // Reset form
  const resetForm = () => {
    setEditingPropertyId(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('casa_t3');
    setFormTransaction('venda');
    setFormPrice('');
    setFormCurrency('AOA');
    setFormPricePeriod('total');
    setFormIsPriceOnRequest(false);
    setFormProvince('Luanda');
    setFormCity('Kilamba (Centralidade)');
    setFormNeighborhood('');
    setFormReferencePoint('');
    setFormLotDimensions('20m x 30m (600m²)');
    setFormTotalArea('');
    setFormBuiltArea('');
    setFormBedrooms(3);
    setFormSuites(1);
    setFormBathrooms(2);
    setFormKitchens(1);
    setFormLivingRooms(1);
    setFormBalconies('');
    setFormPantries('');
    setFormOffices('');
    setFormOtherRooms('');
    setFormParking(2);
    setFormHasPool(false);
    setFormHasWaterTank(true);
    setFormHasGenerator(false);
    setFormHasSecurity(true);
    setFormHasTitleDeed(true);
    setFormImages([]);
    setFormVideoUrl('');
    setPublishStatus({ type: null, message: '' });
  };

  // Populate form for editing
  const handleEditProperty = (p: PropertyItem) => {
    setEditingPropertyId(p.id);
    setFormTitle(p.title);
    setFormDescription(p.description);
    setFormCategory(p.category);
    setFormTransaction(p.transactionType);
    setFormPrice(p.price || '');
    setFormCurrency(p.currency || 'AOA');
    setFormPricePeriod(p.pricePeriod || 'total');
    setFormIsPriceOnRequest(Boolean(p.isPriceOnRequest));
    setFormProvince(p.location.province || 'Luanda');
    setFormCity(p.location.cityOrDistrict || 'Kilamba (Centralidade)');
    setFormNeighborhood(p.location.neighborhood || '');
    setFormReferencePoint(p.location.referencePoint || '');
    setFormLotDimensions(p.dimensions?.lotDimensions || '');
    setFormTotalArea(p.dimensions?.totalAreaM2 || '');
    setFormBuiltArea(p.dimensions?.builtAreaM2 || '');
    setFormBedrooms(p.features?.bedrooms || '');
    setFormSuites(p.features?.suites || '');
    setFormBathrooms(p.features?.bathrooms || '');
    setFormKitchens(p.features?.kitchens ?? 1);
    setFormLivingRooms(p.features?.livingRooms ?? 1);
    setFormBalconies(p.features?.balconies ?? '');
    setFormPantries(p.features?.pantries ?? '');
    setFormOffices(p.features?.offices ?? '');
    setFormOtherRooms(p.features?.otherRooms || '');
    setFormParking(p.features?.parkingSpots || '');
    setFormHasPool(Boolean(p.features?.hasPool));
    setFormHasWaterTank(Boolean(p.features?.hasWaterTank));
    setFormHasGenerator(Boolean(p.features?.hasGenerator));
    setFormHasSecurity(Boolean(p.features?.hasSecurity24h));
    setFormHasTitleDeed(Boolean(p.features?.hasTitleDeed));
    setFormImages(p.images || []);
    setFormVideoUrl(p.videoUrl || '');
    setActiveTab('publicar');
  };

  // Save Property
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setPublishStatus({ type: 'error', message: 'O título do anúncio é obrigatório.' });
      return;
    }

    setIsSaving(true);
    setPublishStatus({ type: null, message: '' });

    const propertyObj: PropertyItem = {
      id: editingPropertyId || `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: formTitle.trim(),
      description: formDescription.trim(),
      category: formCategory,
      transactionType: formTransaction,
      price: typeof formPrice === 'number' ? formPrice : 0,
      currency: formCurrency,
      pricePeriod: formPricePeriod,
      isPriceOnRequest: formIsPriceOnRequest,
      location: {
        province: formProvince,
        cityOrDistrict: formCity,
        neighborhood: formNeighborhood.trim(),
        referencePoint: formReferencePoint.trim(),
      },
      dimensions: {
        totalAreaM2: typeof formTotalArea === 'number' ? formTotalArea : undefined,
        builtAreaM2: typeof formBuiltArea === 'number' ? formBuiltArea : undefined,
        lotDimensions: formLotDimensions.trim(),
      },
      features: {
        bedrooms: typeof formBedrooms === 'number' ? formBedrooms : undefined,
        suites: typeof formSuites === 'number' ? formSuites : undefined,
        bathrooms: typeof formBathrooms === 'number' ? formBathrooms : undefined,
        kitchens: typeof formKitchens === 'number' ? formKitchens : undefined,
        livingRooms: typeof formLivingRooms === 'number' ? formLivingRooms : undefined,
        balconies: typeof formBalconies === 'number' ? formBalconies : undefined,
        pantries: typeof formPantries === 'number' ? formPantries : undefined,
        offices: typeof formOffices === 'number' ? formOffices : undefined,
        otherRooms: formOtherRooms.trim() || undefined,
        parkingSpots: typeof formParking === 'number' ? formParking : undefined,
        hasPool: formHasPool,
        hasWaterTank: formHasWaterTank,
        hasGenerator: formHasGenerator,
        hasSecurity24h: formHasSecurity,
        hasTitleDeed: formHasTitleDeed,
      },
      images: formImages.length > 0 ? formImages : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      videoUrl: formVideoUrl.trim() || undefined,
      isFeatured: true,
      status: 'disponivel',
      createdAt: Date.now(),
    };

    try {
      await savePropertyToFirestore(propertyObj);
      setPublishStatus({ 
        type: 'success', 
        message: editingPropertyId 
          ? 'Imóvel atualizado na nuvem com sucesso! Sincronizado para todos os telemóveis e computadores.' 
          : 'Novo anúncio publicado na nuvem em tempo real com sucesso! Visível para todos os visitantes.' 
      });
      setConnectivityStatus('connected');
      onPropertiesUpdated();
      resetForm();
    } catch (err: any) {
      setConnectivityStatus('error');
      setConnectivityError(err?.message || 'Permissão negada');
      setPublishStatus({ 
        type: 'error', 
        message: `Atenção: Salvo apenas neste aparelho! O Firebase recusou a gravação na nuvem (${err?.message || 'Permissão negada'}). Vá na aba "Conexão Firebase & Regras" para copiar as regras no Console do Firebase.` 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Property
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza de que deseja excluir este imóvel do portal?')) {
      await deletePropertyFromFirestore(id);
      onPropertiesUpdated();
    }
  };

  // Toggle Property Status
  const handleToggleStatus = async (property: PropertyItem, status: PropertyStatus) => {
    await savePropertyToFirestore({ ...property, status });
    onPropertiesUpdated();
  };

  // Reply in Chat as Admin
  const handleAdminSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversationId || !adminReplyText.trim()) return;

    const text = adminReplyText.trim();
    setAdminReplyText('');

    await sendChatMessage(selectedConversationId, {
      conversationId: selectedConversationId,
      sender: 'admin',
      clientName: 'Gemmp Construção Civil & Imobiliária',
      text,
      isRead: true,
    });
  };

  // Load sample data
  const handleSeedDemoData = async () => {
    for (const p of SAMPLE_ANGOLA_PROPERTIES) {
      await savePropertyToFirestore(p);
    }
    onPropertiesUpdated();
    alert('3 Imóveis de demonstração carregados com sucesso no Kilamba, Futungo e Talatona!');
  };

  // Clear all data
  const handleClearAllData = async () => {
    if (confirm('Atenção: deseja realmente limpar todos os imóveis e deixar o catálogo 100% vago para apresentar à imobiliária?')) {
      for (const p of properties) {
        await deletePropertyFromFirestore(p.id);
      }
      onPropertiesUpdated();
      alert('Catálogo limpo com sucesso!');
    }
  };

  // Generate Encrypted Backup
  const handleGenerateBackup = () => {
    const enc = exportEncryptedBackup(backupKey);
    setBackupPayload(enc);
    setBackupMessage('Backup criptografado gerado com sucesso!');
  };

  // Restore Encrypted Backup
  const handleRestoreBackup = () => {
    if (!restorePayload.trim()) return;
    const res = restoreEncryptedBackup(restorePayload.trim(), backupKey);
    if (res.success) {
      onPropertiesUpdated();
      setBackupMessage(`Restauração concluída! ${res.count} registros restaurados.`);
      setRestorePayload('');
    } else {
      setBackupMessage(`Falha na restauração: ${res.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border-2 border-amber-500 max-h-[94vh] flex flex-col">
        
        {/* Top Header */}
        <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between border-b-2 border-amber-500 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-heading flex items-center">
                Painel Administrativo da Gemmp
                <span className="ml-2 text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black uppercase">
                  ADM
                </span>
              </h2>
              <p className="text-xs text-amber-400">
                Gestão de Lotes, Imóveis, Conversas e Backup Criptografado
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center"
                title="Terminar Sessão do Administrador"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Sair
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Login View */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto my-auto w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 font-heading">
                Acesso Restrito ao Gestor Gemmp
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Introduza as credenciais da imobiliária para aceder à gestão.
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail do Administrador:
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="gemmpeimoveis93221@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Palavra-passe:
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-colors flex items-center justify-center cursor-pointer"
              >
                {authLoading ? 'A verificar...' : 'Aceder ao Painel'}
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-400">
                  Gemmp Construção Civil & Imobiliária • Acesso Oficial
                </span>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated: Tabs Layout */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Sub-navbar with Tabs */}
            <div className="bg-slate-100 p-2 border-b border-slate-200 flex gap-1 overflow-x-auto shrink-0 scrollbar-thin">
              <button
                onClick={() => setActiveTab('publicar')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center transition-all ${
                  activeTab === 'publicar' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                {editingPropertyId ? 'Editar Imóvel' : 'Publicar Novo Imóvel / Lote'}
              </button>

              <button
                onClick={() => setActiveTab('imoveis')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center transition-all ${
                  activeTab === 'imoveis' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 mr-1.5" />
                Gerir Imóveis ({properties.length})
              </button>

              <button
                onClick={() => setActiveTab('publicidade')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center transition-all ${
                  activeTab === 'publicidade' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
                Caixas de Publicidade (3 Destaques)
              </button>

              <button
                onClick={() => setActiveTab('conversas')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center transition-all relative ${
                  activeTab === 'conversas' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                Mensagens dos Clientes
                {conversations.some((c) => c.unreadCount > 0) && (
                  <span className="ml-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center transition-all ${
                  activeTab === 'backup' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Backup Criptografado
              </button>

              <button
                onClick={() => setActiveTab('apresentacao')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center transition-all ${
                  activeTab === 'apresentacao' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Demonstração & Limpeza
              </button>

              <button
                onClick={() => {
                  setActiveTab('firebase');
                  runConnectivityTest();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center transition-all ${
                  activeTab === 'firebase' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                {connectivityStatus === 'connected' ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
                ) : connectivityStatus === 'checking' ? (
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin text-amber-500" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5 inline-block animate-ping" />
                )}
                Conexão Firebase & Regras
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              
              {/* TAB 1: Publicar / Editar */}
              {activeTab === 'publicar' && (
                <form onSubmit={handleSaveProperty} className="space-y-6 max-w-3xl mx-auto">
                  {publishStatus.message && (
                    <div className={`p-4 rounded-xl text-xs font-bold flex items-center ${
                      publishStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {publishStatus.type === 'success' ? <Check className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                      <span>{publishStatus.message}</span>
                    </div>
                  )}

                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center">
                      <Tag className="w-4 h-4 mr-1 text-amber-600" />
                      1. Informações Básicas do Imóvel ou Terreno
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Título Chamativo do Anúncio: *
                        </label>
                        <input
                          type="text"
                          required
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="Ex: Vivenda T4 Moderna com Piscina no Kilamba / Lote 20x30m no Futungo de Belas"
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700">
                            Categoria do Imóvel:
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsAddingCategory(!isAddingCategory)}
                            className="text-[11px] font-black text-amber-700 hover:text-amber-800 flex items-center bg-amber-100/80 px-2 py-0.5 rounded cursor-pointer"
                          >
                            <Plus className="w-3 h-3 mr-0.5" />
                            {isAddingCategory ? 'Fechar' : '+ Nova Categoria'}
                          </button>
                        </div>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value as PropertyCategory)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        >
                          <optgroup label="Categorias Principais">
                            {CATEGORIES.filter((c) => c.value !== 'todos').map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </optgroup>
                          {customCategories.length > 0 && (
                            <optgroup label="Categorias Criadas pelo ADM">
                              {customCategories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                  ⭐ {cat.label}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>

                        {isAddingCategory && (
                          <div className="mt-2 p-2.5 bg-amber-100/70 border border-amber-300 rounded-xl space-y-2">
                            <span className="text-[11px] font-black text-amber-900 block">Adicionar Nova Categoria:</span>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={newCategoryInput}
                                onChange={(e) => setNewCategoryInput(e.target.value)}
                                placeholder="Ex: Vivenda Duplex T5, Armazém..."
                                className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                              />
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!newCategoryInput.trim()) return;
                                  const saved = await saveCustomCategory(newCategoryInput);
                                  setCustomCategories(prev => [...prev.filter(c => c.value !== saved.value), saved]);
                                  setFormCategory(saved.value as any);
                                  setNewCategoryInput('');
                                  setIsAddingCategory(false);
                                }}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg cursor-pointer shadow-sm"
                              >
                                Gravar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tipo de Operação:
                        </label>
                        <select
                          value={formTransaction}
                          onChange={(e) => setFormTransaction(e.target.value as TransactionType)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        >
                          <option value="venda">Venda</option>
                          <option value="arrendamento">Arrendamento</option>
                          <option value="construcao">Construção & Projeto</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Preço ({formCurrency}):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            disabled={formIsPriceOnRequest}
                            value={formPrice}
                            onChange={(e) => setFormPrice(e.target.value ? Number(e.target.value) : '')}
                            placeholder="Ex: 45000000"
                            className="flex-1 px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-slate-100"
                          />
                          <select
                            value={formCurrency}
                            onChange={(e) => setFormCurrency(e.target.value as any)}
                            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                          >
                            <option value="AOA">Kz (AOA)</option>
                            <option value="USD">USD ($)</option>
                          </select>
                        </div>
                        <label className="flex items-center space-x-2 mt-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formIsPriceOnRequest}
                            onChange={(e) => setFormIsPriceOnRequest(e.target.checked)}
                            className="rounded text-amber-600"
                          />
                          <span className="text-[11px] font-bold text-slate-600">Sob Consulta (Sem preço visível)</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Cobrança:
                        </label>
                        <select
                          value={formPricePeriod}
                          onChange={(e) => setFormPricePeriod(e.target.value as any)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        >
                          <option value="total">Preço Total (Compra / Venda)</option>
                          <option value="mensal">Mensal (Renda / Aluguer)</option>
                          <option value="sob_consulta">Sob Consulta</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. Dimensões e Localização */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center">
                      <Maximize2 className="w-4 h-4 mr-1 text-amber-600" />
                      2. Dimensões Milimétricas & Localização em Angola
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Dimensões do Terreno:
                        </label>
                        <input
                          type="text"
                          value={formLotDimensions}
                          onChange={(e) => setFormLotDimensions(e.target.value)}
                          placeholder="Ex: 20m x 30m = 600m²"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Área Total (m²):
                        </label>
                        <input
                          type="number"
                          value={formTotalArea}
                          onChange={(e) => setFormTotalArea(e.target.value ? Number(e.target.value) : '')}
                          placeholder="Ex: 600"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Área Construída (m²):
                        </label>
                        <input
                          type="number"
                          value={formBuiltArea}
                          onChange={(e) => setFormBuiltArea(e.target.value ? Number(e.target.value) : '')}
                          placeholder="Ex: 280"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700">
                            Localidade / Centralidade:
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsAddingLocality(!isAddingLocality)}
                            className="text-[11px] font-black text-amber-700 hover:text-amber-800 flex items-center bg-amber-100/80 px-2 py-0.5 rounded cursor-pointer"
                          >
                            <Plus className="w-3 h-3 mr-0.5" />
                            {isAddingLocality ? 'Fechar' : '+ Nova Localidade'}
                          </button>
                        </div>
                        <select
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        >
                          {customLocalities.length > 0 && (
                            <optgroup label="Localidades Adicionadas pelo ADM">
                              {customLocalities.map((loc) => (
                                <option key={loc} value={loc}>
                                  ⭐ {loc}
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {ANGOLA_LOCATIONS.map((g) => (
                            <optgroup key={g.group} label={g.group}>
                              {g.cities.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>

                        {isAddingLocality && (
                          <div className="mt-2 p-2.5 bg-amber-100/70 border border-amber-300 rounded-xl space-y-2">
                            <span className="text-[11px] font-black text-amber-900 block">Adicionar Nova Localidade / Bairro:</span>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={newLocalityInput}
                                onChange={(e) => setNewLocalityInput(e.target.value)}
                                placeholder="Ex: Cacuaco - Centralidade, Maculusso Norte..."
                                className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                              />
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!newLocalityInput.trim()) return;
                                  const savedLoc = await saveCustomLocality(newLocalityInput);
                                  setCustomLocalities(prev => [...prev.filter(l => l !== savedLoc), savedLoc]);
                                  setFormCity(savedLoc);
                                  setNewLocalityInput('');
                                  setIsAddingLocality(false);
                                }}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg cursor-pointer shadow-sm"
                              >
                                Gravar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Bairro / Condomínio:
                        </label>
                        <input
                          type="text"
                          value={formNeighborhood}
                          onChange={(e) => setFormNeighborhood(e.target.value)}
                          placeholder="Ex: Setor das Vivendas / Bloco B"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Ponto de Referência:
                        </label>
                        <input
                          type="text"
                          value={formReferencePoint}
                          onChange={(e) => setFormReferencePoint(e.target.value)}
                          placeholder="Ex: Próximo à via expressa"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Comodidades & Cómodos */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center">
                      <Home className="w-4 h-4 mr-1 text-amber-600" />
                      3. Cómodos, Divisões & Infraestrutura
                    </h4>
                    
                    {/* Primary Rooms Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Quartos:</label>
                        <input
                          type="number"
                          value={formBedrooms}
                          onChange={(e) => setFormBedrooms(e.target.value ? Number(e.target.value) : '')}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Suítes:</label>
                        <input
                          type="number"
                          value={formSuites}
                          onChange={(e) => setFormSuites(e.target.value ? Number(e.target.value) : '')}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Casas Banho:</label>
                        <input
                          type="number"
                          value={formBathrooms}
                          onChange={(e) => setFormBathrooms(e.target.value ? Number(e.target.value) : '')}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Cozinhas:</label>
                        <input
                          type="number"
                          value={formKitchens}
                          onChange={(e) => setFormKitchens(e.target.value ? Number(e.target.value) : '')}
                          placeholder="1"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Salas Estar/Jantar:</label>
                        <input
                          type="number"
                          value={formLivingRooms}
                          onChange={(e) => setFormLivingRooms(e.target.value ? Number(e.target.value) : '')}
                          placeholder="1"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Garagens:</label>
                        <input
                          type="number"
                          value={formParking}
                          onChange={(e) => setFormParking(e.target.value ? Number(e.target.value) : '')}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                    </div>

                    {/* Secondary Rooms Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Varandas:</label>
                        <input
                          type="number"
                          value={formBalconies}
                          onChange={(e) => setFormBalconies(e.target.value ? Number(e.target.value) : '')}
                          placeholder="Ex: 2"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Despensas:</label>
                        <input
                          type="number"
                          value={formPantries}
                          onChange={(e) => setFormPantries(e.target.value ? Number(e.target.value) : '')}
                          placeholder="Ex: 1"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Escritórios / Gabinete:</label>
                        <input
                          type="number"
                          value={formOffices}
                          onChange={(e) => setFormOffices(e.target.value ? Number(e.target.value) : '')}
                          placeholder="Ex: 1"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Outros Cómodos:</label>
                        <input
                          type="text"
                          value={formOtherRooms}
                          onChange={(e) => setFormOtherRooms(e.target.value)}
                          placeholder="Ex: Anexo com WC, Lavandaria, Quintal"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-bold text-slate-700">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input type="checkbox" checked={formHasPool} onChange={(e) => setFormHasPool(e.target.checked)} />
                        <span>Piscina</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input type="checkbox" checked={formHasWaterTank} onChange={(e) => setFormHasWaterTank(e.target.checked)} />
                        <span>Tanque de Água</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input type="checkbox" checked={formHasGenerator} onChange={(e) => setFormHasGenerator(e.target.checked)} />
                        <span>Gerador</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input type="checkbox" checked={formHasSecurity} onChange={(e) => setFormHasSecurity(e.target.checked)} />
                        <span>Segurança 24h</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer col-span-2">
                        <input type="checkbox" checked={formHasTitleDeed} onChange={(e) => setFormHasTitleDeed(e.target.checked)} />
                        <span className="text-emerald-700">Direito de Superfície / Escritura Pública</span>
                      </label>
                    </div>
                  </div>

                  {/* 4. Descrição */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Descrição Detalhada do Imóvel:
                    </label>
                    <textarea
                      rows={4}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Descreva detalhes como acabamentos, proximidades com vias principais no Kilamba ou Futungo, facilidades de pagamento, etc."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* 5. Fotografias & Vídeo */}
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center">
                        <Camera className="w-4 h-4 mr-1 text-amber-600" />
                        5. Fotografias e Vídeos do Imóvel
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600">
                      Selecione fotografias da sua galeria ou câmera para anexar ao anúncio.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs cursor-pointer flex items-center shadow">
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        {isCompressingImage ? 'A Comprimir...' : 'Carregar Fotos da Galeria'}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isCompressingImage}
                        />
                      </label>

                      <span className="text-xs text-slate-400">ou adicione link direto de imagem:</span>

                      <div className="flex gap-2 flex-1 min-w-[240px]">
                        <input
                          type="url"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="https://exemplo.com/foto.jpg"
                          className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleAddExternalImageUrl}
                          className="px-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>

                    {/* Previews */}
                    {formImages.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pt-2 pb-1 scrollbar-thin">
                        {formImages.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-amber-300 group">
                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 bg-rose-600 text-white p-0.5 rounded-full opacity-80 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Video URL */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
                        <Video className="w-3.5 h-3.5 mr-1 text-amber-600" />
                        Link de Vídeo Curto (YouTube, MP4 ou Galeria):
                      </label>
                      <input
                        type="url"
                        value={formVideoUrl}
                        onChange={(e) => setFormVideoUrl(e.target.value)}
                        placeholder="Ex: https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          A Publicar no Firestore...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          {editingPropertyId ? 'Salvar Alterações no Imóvel' : 'Publicar Imóvel Agora'}
                        </>
                      )}
                    </button>

                    {editingPropertyId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                      >
                        Cancelar Edição
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* TAB 2: Gerir Imóveis */}
              {activeTab === 'imoveis' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-black text-slate-900 font-heading">
                      Imóveis Cadastrados ({properties.length})
                    </h3>
                    <button
                      onClick={() => {
                        resetForm();
                        setActiveTab('publicar');
                      }}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center shadow"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1" />
                      Novo Imóvel
                    </button>
                  </div>

                  {properties.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                      Nenhum imóvel cadastrado no portal. Use a aba "Publicar Novo Imóvel" ou carregue a demonstração.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                      {properties.map((p) => (
                        <div key={p.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-50/30">
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                              alt={p.title}
                              className="w-16 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                  p.status === 'disponivel' ? 'bg-emerald-100 text-emerald-800' : p.status === 'reservado' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {p.status}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500">
                                  {p.location.cityOrDistrict}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{p.title}</h4>
                              <p className="text-xs font-black text-amber-600">
                                {formatPriceAOA(p.price, p.currency)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {/* Status Quick Toggles */}
                            <select
                              value={p.status}
                              onChange={(e) => handleToggleStatus(p, e.target.value as PropertyStatus)}
                              className="text-xs font-bold border border-slate-300 rounded-lg px-2 py-1 bg-white"
                            >
                              <option value="disponivel">Disponível</option>
                              <option value="reservado">Reservado</option>
                              <option value="vendido">Vendido</option>
                            </select>

                            <button
                              onClick={() => handleEditProperty(p)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-slate-950"
                              title="Editar imóvel"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600"
                              title="Excluir imóvel"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Mensagens & Conversas dos Clientes */}
              {activeTab === 'conversas' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[520px]">
                  
                  {/* Left: Conversations list */}
                  <div className="md:col-span-4 border border-slate-200 rounded-2xl overflow-y-auto bg-white p-2 divide-y divide-slate-100">
                    <div className="p-2 font-black text-xs text-slate-700 uppercase tracking-wider">
                      Conversas de Clientes ({conversations.length})
                    </div>
                    {conversations.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        Nenhuma mensagem recebida ainda.
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversationId(conv.id)}
                          className={`p-3 rounded-xl cursor-pointer transition-colors ${
                            selectedConversationId === conv.id ? 'bg-amber-100/70 border border-amber-300' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-extrabold text-xs text-slate-900 truncate">
                              {conv.clientName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(conv.lastUpdated).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
                            </span>
                          </div>
                          {conv.clientPhone && (
                            <span className="text-[11px] text-emerald-600 font-bold block">
                              WhatsApp: {conv.clientPhone}
                            </span>
                          )}
                          <p className="text-xs text-slate-600 truncate mt-0.5">
                            {conv.lastMessage}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="inline-block mt-1 text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                              Nova mensagem
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Right: Selected Conversation View & Reply */}
                  <div className="md:col-span-8 border border-slate-200 rounded-2xl flex flex-col bg-slate-50 overflow-hidden">
                    {selectedConversationId ? (
                      <>
                        {/* Conversation Header */}
                        <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-xs text-slate-900 block">
                              {conversations.find((c) => c.id === selectedConversationId)?.clientName || 'Cliente'}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Contato: {conversations.find((c) => c.id === selectedConversationId)?.clientPhone || 'Não informado'}
                            </span>
                          </div>

                          {conversations.find((c) => c.id === selectedConversationId)?.clientPhone && (
                            <a
                              href={`https://wa.me/${conversations.find((c) => c.id === selectedConversationId)?.clientPhone?.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                            >
                              Abrir no WhatsApp
                            </a>
                          )}
                        </div>

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                          {activeMessages.map((m) => {
                            const isMe = m.sender === 'admin';
                            return (
                              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                                  isMe ? 'bg-amber-500 text-slate-950 font-medium' : 'bg-white text-slate-800 border border-slate-200'
                                }`}>
                                  <span className="block text-[10px] font-black opacity-70 mb-0.5">
                                    {isMe ? 'Gemmp (ADM)' : m.clientName}
                                  </span>
                                  {m.propertyTitle && (
                                    <div className="mb-1 p-1 bg-black/10 rounded text-[10px] font-bold">
                                      Referência: {m.propertyTitle}
                                    </div>
                                  )}
                                  <p>{m.text}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Reply input */}
                        <form onSubmit={handleAdminSendReply} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
                          <input
                            type="text"
                            value={adminReplyText}
                            onChange={(e) => setAdminReplyText(e.target.value)}
                            placeholder="Responder ao cliente como Gemmp..."
                            className="flex-1 px-3 py-2 bg-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center shadow"
                          >
                            <Send className="w-3.5 h-3.5 mr-1" />
                            Responder
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                        Selecione uma conversa à esquerda para visualizar e responder.
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 4: Backup Criptografado de Ponta a Ponta */}
              {activeTab === 'backup' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-600" />
                      Sistema de Backup Criptografado de Ponta a Ponta
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Exporte todos os imóveis, fotos e dados com chave de segurança reversível. Você pode guardar uma cópia em ficheiro e restaurar a qualquer momento.
                    </p>
                  </div>

                  {backupMessage && (
                    <div className="p-3 rounded-xl bg-slate-900 text-amber-400 text-xs font-bold">
                      {backupMessage}
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700">
                      Chave de Criptografia:
                    </label>
                    <input
                      type="text"
                      value={backupKey}
                      onChange={(e) => setBackupKey(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  {/* Export */}
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-slate-900 flex items-center">
                      <Download className="w-4 h-4 mr-1.5 text-amber-600" />
                      Exportar Dados Actuais
                    </h5>
                    <button
                      onClick={handleGenerateBackup}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center shadow"
                    >
                      Gerar Cópia Criptografada
                    </button>
                    {backupPayload && (
                      <div>
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">
                          Código do Backup (Copie e guarde):
                        </span>
                        <textarea
                          readOnly
                          rows={3}
                          value={backupPayload}
                          className="w-full p-2 bg-slate-100 text-[10px] font-mono rounded-lg border border-slate-300 select-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Restore */}
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-slate-900 flex items-center">
                      <Upload className="w-4 h-4 mr-1.5 text-amber-600" />
                      Restaurar de Cópia Criptografada
                    </h5>
                    <textarea
                      rows={3}
                      value={restorePayload}
                      onChange={(e) => setRestorePayload(e.target.value)}
                      placeholder="Cole aqui o código do backup criptografado..."
                      className="w-full p-2 bg-slate-50 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                    <button
                      onClick={handleRestoreBackup}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl text-xs flex items-center shadow"
                    >
                      Restaurar Agora
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: Caixas de Publicidade */}
              {activeTab === 'publicidade' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 font-heading">
                        3 Caixas de Publicidade em Destaque
                      </h4>
                      <p className="text-xs text-slate-600">
                        Edite as 3 caixas horizontais do topo do site. O ADM pode publicar novas fotos, chamadas promocionais e destaques a qualquer momento.
                      </p>
                    </div>

                    <button
                      onClick={handleSavePublicityCards}
                      disabled={isSavingPublicity}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center cursor-pointer shrink-0"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      {isSavingPublicity ? 'A Guardar...' : 'Salvar Alterações'}
                    </button>
                  </div>

                  {publicityStatusMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{publicityStatusMessage}</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    {publicityCards.map((card, idx) => (
                      <div key={card.id || idx} className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-2xl p-4 sm:p-5 shadow-sm transition-all space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-900 text-amber-400">
                            Caixa #{idx + 1}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            Posição Horizontal {idx + 1} de 3
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Image preview & upload */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-700">
                              Fotografia de Fundo:
                            </label>
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-300">
                              {card.imageUrl ? (
                                <img
                                  src={card.imageUrl}
                                  alt={card.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                  Sem imagem
                                </div>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <input
                                type="url"
                                value={card.imageUrl}
                                onChange={(e) => handleUpdateCardField(idx, 'imageUrl', e.target.value)}
                                placeholder="Link da imagem (URL)..."
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                              />
                              <label className="flex items-center justify-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold cursor-pointer border border-slate-300">
                                <Upload className="w-3.5 h-3.5 mr-1 text-amber-600" />
                                Carregar Foto do Dispositivo
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      const base64 = await compressImageFile(file, 1000, 750, 0.8);
                                      handleUpdateCardField(idx, 'imageUrl', base64);
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Text contents */}
                          <div className="md:col-span-2 space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Etiqueta / Badge Promocional:
                              </label>
                              <input
                                type="text"
                                value={card.badge}
                                onChange={(e) => handleUpdateCardField(idx, 'badge', e.target.value)}
                                placeholder="Ex: OPORTUNIDADE EXCLUSIVA"
                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Título Principal:
                              </label>
                              <input
                                type="text"
                                value={card.title}
                                onChange={(e) => handleUpdateCardField(idx, 'title', e.target.value)}
                                placeholder="Ex: Vivendas T3 e T4 no Kilamba"
                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Descrição Promocional:
                              </label>
                              <textarea
                                rows={2}
                                value={card.subtitle}
                                onChange={(e) => handleUpdateCardField(idx, 'subtitle', e.target.value)}
                                placeholder="Ex: Casas prontas a habitar com suíte, quintal e facilidades de pagamento."
                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Texto do Botão de Ação:
                              </label>
                              <input
                                type="text"
                                value={card.actionText}
                                onChange={(e) => handleUpdateCardField(idx, 'actionText', e.target.value)}
                                placeholder="Ex: Ver Imóveis Disponíveis"
                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSavePublicityCards}
                      disabled={isSavingPublicity}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center cursor-pointer"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {isSavingPublicity ? 'A Guardar no Site...' : 'Publicar Alterações das Caixas'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: Apresentação & Demonstração */}
              {activeTab === 'apresentacao' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Gestão de Demonstração & Catálogo
                    </h4>
                    <p className="text-xs text-slate-600">
                      Você pode carregar imóveis modelo para apresentar à imobiliária ou deixar o portal vago para iniciar a inserção dos seus primeiros contratos:
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={handleSeedDemoData}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 mr-1.5" />
                        Carregar 3 Imóveis Modelo (Kilamba/Futungo)
                      </button>

                      <button
                        onClick={handleClearAllData}
                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow flex items-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Limpar Tudo e Deixar Vago
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Conexão Firebase & Regras em Tempo Real */}
              {activeTab === 'firebase' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Status Banner */}
                  <div className={`p-5 rounded-2xl border ${
                    connectivityStatus === 'connected'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : connectivityStatus === 'checking'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2.5 rounded-xl text-white ${
                          connectivityStatus === 'connected'
                            ? 'bg-emerald-600'
                            : connectivityStatus === 'checking'
                            ? 'bg-amber-500'
                            : 'bg-rose-600'
                        }`}>
                          {connectivityStatus === 'connected' ? (
                            <Cloud className="w-6 h-6" />
                          ) : connectivityStatus === 'checking' ? (
                            <RefreshCw className="w-6 h-6 animate-spin" />
                          ) : (
                            <CloudOff className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-wide">
                            {connectivityStatus === 'connected'
                              ? 'Conexão Firebase 100% Ativa na Nuvem!'
                              : connectivityStatus === 'checking'
                              ? 'A Testar Comunicação com o Firebase Firestore...'
                              : 'Conexão com a Nuvem Bloqueada pelo Firebase'}
                          </h4>
                          <p className="text-xs mt-1 leading-relaxed">
                            {connectivityStatus === 'connected'
                              ? 'Excelente! O banco de dados Firestore está a responder e autorizando leituras e gravações em tempo real. Todos os visitantes e aparelhos recebem as suas publicações e mensagens de chat imediatamente.'
                              : connectivityStatus === 'checking'
                              ? 'A realizar teste de envio de ping ao projeto gemmp-49e82...'
                              : `O Firebase retornou: "${connectivityError || 'PERMISSION_DENIED'}". As regras de segurança no Console do Firebase estão a rejeitar a sincronização entre aparelhos. Basta colar as regras abaixo no Console para desbloquear.`}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={runConnectivityTest}
                        className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center shrink-0 shadow cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        Testar Agora
                      </button>
                    </div>
                  </div>

                  {/* Instructions & Code Box */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 font-heading flex items-center">
                          <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-500" />
                          Regras Oficiais do Firestore (Plano Gratuito Sem Travas)
                        </h4>
                        <p className="text-xs text-slate-500">
                          Copie e cole este código diretamente no Firebase Console para liberar a conectividade universal.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const code = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;
                            navigator.clipboard.writeText(code);
                            setCopiedRules(true);
                            setTimeout(() => setCopiedRules(false), 3000);
                          }}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center shadow transition-all cursor-pointer"
                        >
                          {copiedRules ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1.5" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1.5" />
                              Copiar Regras
                            </>
                          )}
                        </button>

                        <a
                          href="https://console.firebase.google.com/project/gemmp-49e82/firestore/rules"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs flex items-center shadow cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          Abrir no Console
                        </a>
                      </div>
                    </div>

                    {/* Step-by-step Guide */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="font-black text-amber-600 mr-1.5">Passo 1:</span>
                        Acesse o Firebase Console no projeto <strong>gemmp-49e82</strong>
                      </div>
                      <div>
                        <span className="font-black text-amber-600 mr-1.5">Passo 2:</span>
                        No menu à esquerda, clique em <strong>Firestore Database</strong>
                      </div>
                      <div>
                        <span className="font-black text-amber-600 mr-1.5">Passo 3:</span>
                        Na aba superior, clique em <strong>Regras (Rules)</strong>
                      </div>
                      <div>
                        <span className="font-black text-amber-600 mr-1.5">Passo 4:</span>
                        Apague tudo, cole o código abaixo e clique em <strong>Publicar (Publish)</strong>
                      </div>
                    </div>

                    {/* Rules Code Container */}
                    <div className="relative">
                      <pre className="p-4 bg-slate-950 text-amber-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 1. Permite leitura e gravação em tempo real para todos os dispositivos
    // Sem necessidade de token ou custo extra (100% Spark Gratuito)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                      </pre>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-slate-700">
                      💡 <strong>Por que isso resolve?</strong> Quando você publicou na Vercel, o Firestore estava configurado com a regra padrão de bloqueio (`PERMISSION_DENIED`). Ao aplicar essa regra, o Firebase passa a enviar todas as fotos de casas, terrenos e mensagens de chat instantaneamente via WebSocket para todos os telefones e navegadores sem travar.
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
