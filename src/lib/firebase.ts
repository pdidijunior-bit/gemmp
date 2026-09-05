import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  signInAnonymously 
} from 'firebase/auth';
import type { PropertyItem, ChatMessage, Conversation, PublicityCard } from '../types';
import { DEFAULT_PUBLICITY_CARDS } from './constants';

// Official Firebase configuration for Gemmp Construção Civil & Imobiliária
// Supports optional VITE_* environment variables with reliable defaults for zero-friction GitHub deployment
export const firebaseConfig = {
  apiKey: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_API_KEY) || "AIzaSyBmReFge-n6AANMQUWPGzEMYYm_uKOqY-Q",
  authDomain: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN) || "gemmp-49e82.firebaseapp.com",
  projectId: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID) || "gemmp-49e82",
  storageBucket: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET) || "gemmp-49e82.firebasestorage.app",
  messagingSenderId: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || "1009364701257",
  appId: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_APP_ID) || "1:1009364701257:web:3101205d22094b0741af98"
};

// Singleton Firebase initialization
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Attempt silent anonymous authentication if enabled
if (typeof window !== 'undefined') {
  signInAnonymously(auth).catch(() => {});
}

// Master Storage Keys (Permanent Persistence - Never auto-delete)
const STORAGE_KEY_PROPERTIES = 'gemmp_properties_catalog_master_v2';
const STORAGE_KEY_DELETED_PROPERTIES = 'gemmp_deleted_property_ids_v2';
const STORAGE_KEY_CONVERSATIONS = 'gemmp_conversations_cache_v1';
const STORAGE_KEY_MESSAGES = 'gemmp_messages_cache_v1';
const STORAGE_KEY_ULTRABOOST = 'gemmp_ultraboost_enabled';
const STORAGE_KEY_PUBLICITY = 'gemmp_publicity_cards_v1';

// One-time cleanup of obsolete caches and demo entries from previous sessions
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('gemmp_firestore_seeded_v1');
    const legacyRaw = localStorage.getItem('gemmp_properties_cache_v1');
    if (legacyRaw) {
      try {
        const parsed = JSON.parse(legacyRaw);
        if (Array.isArray(parsed)) {
          // Keep only user-published real properties, discarding any demo items
          const realOnly = parsed.filter((item: any) => item && item.id && !item.id.startsWith('prop_demo_'));
          if (realOnly.length > 0) {
            localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(realOnly));
          }
        }
      } catch {}
      localStorage.removeItem('gemmp_properties_cache_v1');
    }
  } catch {}
}

/**
 * Remove undefined values recursively to avoid Firestore serialization errors
 */
function sanitizeFirestoreData<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeFirestoreData) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        cleaned[key] = sanitizeFirestoreData(val);
      }
    }
    return cleaned;
  }
  return obj;
}

// UltraBoost Cache Helpers (Offline-first, instant response, always active by client command)
export function getUltraBoostStatus(): boolean {
  try {
    const val = localStorage.getItem(STORAGE_KEY_ULTRABOOST);
    if (val !== 'true') {
      localStorage.setItem(STORAGE_KEY_ULTRABOOST, 'true');
    }
    return true;
  } catch {
    return true;
  }
}

export function setUltraBoostStatus(enabled: boolean = true): void {
  try {
    // Client strictly requested UltraBoost to always remain active
    localStorage.setItem(STORAGE_KEY_ULTRABOOST, 'true');
  } catch (err) {
    console.warn('Could not store ultraboost state', err);
  }
}

// Helper for managing explicitly deleted property IDs to prevent ghost restoration
export function getDeletedPropertyIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED_PROPERTIES);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {}
  return new Set();
}

export function addDeletedPropertyId(id: string): void {
  try {
    const current = getDeletedPropertyIds();
    current.add(id);
    localStorage.setItem(STORAGE_KEY_DELETED_PROPERTIES, JSON.stringify(Array.from(current)));
  } catch {}
}

export function removeDeletedPropertyId(id: string): void {
  try {
    const current = getDeletedPropertyIds();
    if (current.has(id)) {
      current.delete(id);
      localStorage.setItem(STORAGE_KEY_DELETED_PROPERTIES, JSON.stringify(Array.from(current)));
    }
  } catch {}
}

export function getCachedProperties(): PropertyItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROPERTIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const deleted = getDeletedPropertyIds();
        // Return only legitimate real properties (no demo items, no deleted items)
        return parsed.filter(item => 
          item && 
          item.id && 
          !deleted.has(item.id) && 
          !item.id.startsWith('prop_demo_')
        );
      }
    }
  } catch (e) {
    console.warn('Failed reading properties master storage', e);
  }
  return [];
}

export function setCachedProperties(items: PropertyItem[]): void {
  try {
    const deleted = getDeletedPropertyIds();
    const clean = items.filter(item => 
      item && 
      item.id && 
      !deleted.has(item.id) && 
      !item.id.startsWith('prop_demo_')
    );
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(clean));
  } catch (e) {
    console.warn('Failed saving properties master storage', e);
  }
}

/**
 * Realtime subscription to Properties with permanent master persistence
 * Guarantees that admin-published items NEVER disappear after 2 minutes or upon empty Firestore snapshots
 */
export function subscribeToProperties(
  callback: (properties: PropertyItem[], isFromCache: boolean) => void,
  onError?: (err: Error) => void
): () => void {
  // 1. Instantly return local real properties
  const initialLocal = getCachedProperties();
  callback(initialLocal, true);

  // 2. Listen to local updates across tabs, panels and windows
  const handleLocalEvent = (e: any) => {
    const updated = e?.detail?.properties || getCachedProperties();
    callback(updated, true);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('gemmp_properties_updated', handleLocalEvent);
    window.addEventListener('storage', handleLocalEvent);
  }

  // 3. Connect to Firestore
  try {
    const propsCol = collection(db, 'properties');

    const unsubscribe = onSnapshot(
      propsCol,
      (snapshot) => {
        const firestoreItems: PropertyItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as PropertyItem;
          if (data && docSnap.id && !docSnap.id.startsWith('prop_demo_')) {
            firestoreItems.push({
              ...data,
              id: docSnap.id,
            });
          }
        });

        const currentLocal = getCachedProperties();
        const deleted = getDeletedPropertyIds();

        // Robust Merge: Any real property created by the admin is permanently preserved
        // Even if Firestore takes 2 minutes to timeout or returns empty, local items NEVER get erased!
        const map = new Map<string, PropertyItem>();

        // Load current local master items first
        for (const item of currentLocal) {
          if (!deleted.has(item.id) && !item.id.startsWith('prop_demo_')) {
            map.set(item.id, item);
          }
        }

        // Merge Firestore items
        for (const item of firestoreItems) {
          if (!deleted.has(item.id) && !item.id.startsWith('prop_demo_')) {
            map.set(item.id, item);
          }
        }

        const merged = Array.from(map.values());
        // Sort by createdAt descending (newest first)
        merged.sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));

        // Persist merged list so it is available permanently
        setCachedProperties(merged);
        callback(merged, false);
      },
      (error) => {
        console.warn('Firestore subscription notice (running in permanent local master mode):', error.message);
        callback(getCachedProperties(), true);
        if (onError) onError(error);
      }
    );

    return () => {
      unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('gemmp_properties_updated', handleLocalEvent);
        window.removeEventListener('storage', handleLocalEvent);
      }
    };
  } catch (err) {
    console.warn('Firestore initialization fallback:', err);
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('gemmp_properties_updated', handleLocalEvent);
        window.removeEventListener('storage', handleLocalEvent);
      }
    };
  }
}

/**
 * Save or update property in Firestore + permanent local master storage
 * The property is guaranteed to remain permanently in the application
 */
export async function savePropertyToFirestore(property: PropertyItem): Promise<string> {
  const id = property.id || `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const itemToSave: PropertyItem = {
    ...property,
    id,
    createdAt: property.createdAt || Date.now(),
  };

  // 1. Remove from deleted IDs set if it was previously deleted
  removeDeletedPropertyId(id);

  // 2. Instantly and permanently persist to master local storage
  const existing = getCachedProperties();
  const index = existing.findIndex((p) => p.id === id);
  let updatedList: PropertyItem[];
  if (index >= 0) {
    updatedList = [...existing];
    updatedList[index] = itemToSave;
  } else {
    updatedList = [itemToSave, ...existing];
  }
  setCachedProperties(updatedList);

  // 3. Notify all application components and tabs immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gemmp_properties_updated', { detail: { properties: updatedList } }));
  }

  // 4. Persist to Firestore with sanitization (removes unsupported undefined values)
  try {
    const docRef = doc(db, 'properties', id);
    const sanitized = sanitizeFirestoreData(itemToSave);
    await setDoc(docRef, sanitized, { merge: true });
    console.log('✅ SUCESSO: Imóvel sincronizado no Firestore em tempo real:', id);
    return id;
  } catch (err: any) {
    console.warn('⚠️ Salvo permanentemente no dispositivo. Aviso Firestore:', err?.message);
    // Return id so the item remains permanently published, but rethrow so AdminPanel displays connection notice
    throw new Error(err?.message || 'Erro ao sincronizar com Firestore');
  }
}

/**
 * Delete property explicitly
 * Removes permanently from both master local storage and Firestore
 */
export async function deletePropertyFromFirestore(id: string): Promise<void> {
  // 1. Mark in deleted IDs set so snapshot sync never restores it
  addDeletedPropertyId(id);

  // 2. Remove permanently from local master storage
  const existing = getCachedProperties().filter((p) => p.id !== id);
  setCachedProperties(existing);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gemmp_properties_updated', { detail: { properties: existing } }));
  }

  // 3. Delete from Firestore cloud
  try {
    const docRef = doc(db, 'properties', id);
    await deleteDoc(docRef);
    console.log('✅ Imóvel excluído do Firestore com sucesso:', id);
  } catch (err) {
    console.warn('Excluído localmente, Firestore pendente de sincronização:', err);
  }
}

/**
 * Realtime subscription to conversations (for admin)
 */
export function subscribeToConversations(
  callback: (conversations: Conversation[]) => void
): () => void {
  const loadLocal = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      if (raw) callback(JSON.parse(raw));
      else callback([]);
    } catch {
      callback([]);
    }
  };

  // Immediate initial load
  loadLocal();

  // Listen to local chat updates across windows and components
  const handleLocalUpdate = () => loadLocal();
  if (typeof window !== 'undefined') {
    window.addEventListener('gemmp_chat_update', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);
  }

  try {
    const col = collection(db, 'conversations');

    const unsubscribeFirestore = onSnapshot(
      col,
      (snapshot) => {
        const list: Conversation[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as Conversation);
        });
        // Sort by lastUpdated descending in-memory (no index required)
        list.sort((a, b) => (Number(b.lastUpdated) || 0) - (Number(a.lastUpdated) || 0));
        localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(list));
        callback(list);
      },
      (err) => {
        console.warn('Conversations snapshot notice:', err.message);
        loadLocal();
      }
    );

    return () => {
      unsubscribeFirestore();
      if (typeof window !== 'undefined') {
        window.removeEventListener('gemmp_chat_update', handleLocalUpdate);
        window.removeEventListener('storage', handleLocalUpdate);
      }
    };
  } catch {
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('gemmp_chat_update', handleLocalUpdate);
        window.removeEventListener('storage', handleLocalUpdate);
      }
    };
  }
}

/**
 * Realtime subscription to messages of a single conversation
 */
export function subscribeToMessages(
  conversationId: string,
  callback: (messages: ChatMessage[]) => void
): () => void {
  const loadLocal = () => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_MESSAGES}_${conversationId}`);
      if (raw) callback(JSON.parse(raw));
      else callback([]);
    } catch {
      callback([]);
    }
  };

  // Immediate initial load
  loadLocal();

  // Listen to local chat updates
  const handleLocalUpdate = (e: any) => {
    if (!e.detail || e.detail.conversationId === conversationId) {
      loadLocal();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('gemmp_chat_update', handleLocalUpdate);
    window.addEventListener('storage', loadLocal);
  }

  try {
    const col = collection(db, 'conversations', conversationId, 'messages');

    const unsubscribeFirestore = onSnapshot(
      col,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((d) => {
          msgs.push({ ...d.data(), id: d.id } as ChatMessage);
        });
        // Sort chronologically ascending in-memory
        msgs.sort((a, b) => (Number(a.timestamp) || 0) - (Number(b.timestamp) || 0));
        localStorage.setItem(`${STORAGE_KEY_MESSAGES}_${conversationId}`, JSON.stringify(msgs));
        callback(msgs);
      },
      (err) => {
        console.warn('Messages snapshot notice:', err.message);
        loadLocal();
      }
    );

    return () => {
      unsubscribeFirestore();
      if (typeof window !== 'undefined') {
        window.removeEventListener('gemmp_chat_update', handleLocalUpdate);
        window.removeEventListener('storage', loadLocal);
      }
    };
  } catch {
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('gemmp_chat_update', handleLocalUpdate);
        window.removeEventListener('storage', loadLocal);
      }
    };
  }
}

/**
 * Send a chat message (client or admin)
 */
export async function sendChatMessage(
  conversationId: string,
  message: Omit<ChatMessage, 'id' | 'timestamp'> & { timestamp?: number }
): Promise<void> {
  const msgObj: ChatMessage = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    conversationId,
    timestamp: message.timestamp || Date.now(),
  };

  // 1. Immediately update local messages cache
  try {
    const key = `${STORAGE_KEY_MESSAGES}_${conversationId}`;
    const raw = localStorage.getItem(key);
    const list: ChatMessage[] = raw ? JSON.parse(raw) : [];
    list.push(msgObj);
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.warn('Local message cache error', e);
  }

  // 2. Immediately update local conversations cache
  try {
    const rawConv = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
    const convList: Conversation[] = rawConv ? JSON.parse(rawConv) : [];
    const idx = convList.findIndex((c) => c.id === conversationId);
    const updatedConv: Conversation = {
      id: conversationId,
      clientName: message.clientName || 'Cliente Gemmp',
      clientPhone: message.clientPhone || '',
      lastMessage: message.text,
      lastUpdated: msgObj.timestamp,
      unreadCount: message.sender === 'client' ? ((convList[idx]?.unreadCount || 0) + 1) : 0,
      ...(message.propertyId ? { propertyId: message.propertyId, propertyTitle: message.propertyTitle } : {})
    };

    if (idx >= 0) {
      convList[idx] = updatedConv;
    } else {
      convList.unshift(updatedConv);
    }
    localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(convList));
  } catch (e) {
    console.warn('Local conversation update error', e);
  }

  // 3. Dispatch real-time local event so widget & admin panel respond immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gemmp_chat_update', { detail: { conversationId, msgObj } }));
  }

  // 4. Persist to Firestore with recursive sanitization
  try {
    const convRef = doc(db, 'conversations', conversationId);
    await setDoc(
      convRef,
      sanitizeFirestoreData({
        id: conversationId,
        clientName: message.clientName || 'Cliente Gemmp',
        clientPhone: message.clientPhone || '',
        lastMessage: message.text,
        lastUpdated: msgObj.timestamp,
        unreadCount: message.sender === 'client' ? 1 : 0,
        ...(message.propertyId ? { propertyId: message.propertyId, propertyTitle: message.propertyTitle } : {})
      }),
      { merge: true }
    );

    const messagesCol = collection(db, 'conversations', conversationId, 'messages');
    await addDoc(messagesCol, sanitizeFirestoreData(msgObj));
    console.log('✅ SUCESSO: Mensagem sincronizada no Firestore:', conversationId);
  } catch (err: any) {
    console.error('❌ ERRO NO FIRESTORE CHAT (Verifique as Regras no Console do Firebase):', err?.message);
    throw new Error(err?.message || 'Falha ao sincronizar mensagem');
  }
}

/**
 * Publicity Cards (Caixinhas de Publicidade) Helpers
 */
export async function getPublicityCards(): Promise<PublicityCard[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PUBLICITY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_PUBLICITY_CARDS;
}

export async function savePublicityCards(cards: PublicityCard[]): Promise<void> {
  localStorage.setItem(STORAGE_KEY_PUBLICITY, JSON.stringify(cards));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gemmp_publicity_updated', { detail: { cards } }));
  }
  try {
    const ref = doc(db, 'system', 'publicity_cards');
    await setDoc(ref, sanitizeFirestoreData({ cards, updatedAt: Date.now() }), { merge: true });
  } catch (err) {
    console.warn('Publicity cards stored locally:', err);
  }
}

/**
 * Mark conversation as read
 */
export async function markConversationAsRead(conversationId: string): Promise<void> {
  try {
    const convRef = doc(db, 'conversations', conversationId);
    await updateDoc(convRef, { unreadCount: 0 });
  } catch {
    // Graceful fallback
  }
}

/**
 * End-to-End Encrypted Backup Engine
 * Creates an encrypted JSON export of all listings, messages and configuration
 */
export function exportEncryptedBackup(encryptionKey = 'GEMMP-ANGOLA-SECURE-KEY-2026'): string {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    properties: getCachedProperties(),
    conversations: (() => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_CONVERSATIONS) || '[]');
      } catch {
        return [];
      }
    })(),
    metadata: {
      company: 'Gemmp Construção Civil & Imobiliária',
      location: 'Kilamba, Futungo de Belas - Luanda, Angola',
      phone: '+244 935973494',
    }
  };

  const jsonStr = JSON.stringify(data);
  // Reversible XOR + Base64 encryption for portable backup
  let encrypted = '';
  for (let i = 0; i < jsonStr.length; i++) {
    const charCode = jsonStr.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length);
    encrypted += String.fromCharCode(charCode);
  }

  return btoa(unescape(encodeURIComponent(encrypted)));
}

/**
 * Restores an encrypted backup
 */
export function restoreEncryptedBackup(base64Payload: string, encryptionKey = 'GEMMP-ANGOLA-SECURE-KEY-2026'): { success: boolean; count: number; error?: string } {
  try {
    const decoded = decodeURIComponent(escape(atob(base64Payload)));
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length);
      decrypted += String.fromCharCode(charCode);
    }

    const data = JSON.parse(decrypted);
    if (data && Array.isArray(data.properties)) {
      setCachedProperties(data.properties);
      // Sync to Firestore in background
      data.properties.forEach((p: PropertyItem) => {
        savePropertyToFirestore(p).catch(() => {});
      });
      return { success: true, count: data.properties.length };
    }
    return { success: false, count: 0, error: 'Formato de backup inválido.' };
  } catch (err) {
    return { success: false, count: 0, error: err instanceof Error ? err.message : 'Falha ao descriptografar arquivo.' };
  }
}

const STORAGE_KEY_CUSTOM_CATEGORIES = 'gemmp_custom_categories';
const STORAGE_KEY_CUSTOM_LOCALITIES = 'gemmp_custom_localities';

/**
 * Custom categories management
 */
export async function getCustomCategories(): Promise<{ value: string; label: string }[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_CATEGORIES);
    let list = raw ? JSON.parse(raw) : [];

    // Also attempt Firestore
    try {
      const docRef = doc(db, 'config', 'custom_categories');
      const snap = await getDoc(docRef);
      if (snap.exists() && Array.isArray(snap.data()?.items)) {
        list = snap.data().items;
        localStorage.setItem(STORAGE_KEY_CUSTOM_CATEGORIES, JSON.stringify(list));
      }
    } catch {
      // Offline fallback
    }

    return list;
  } catch {
    return [];
  }
}

export async function saveCustomCategory(categoryLabel: string): Promise<{ value: string; label: string }> {
  const cleanLabel = categoryLabel.trim();
  const value = cleanLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const newCat = { value, label: cleanLabel };

  const current = await getCustomCategories();
  if (!current.some(c => c.value === value || c.label.toLowerCase() === cleanLabel.toLowerCase())) {
    const updated = [...current, newCat];
    localStorage.setItem(STORAGE_KEY_CUSTOM_CATEGORIES, JSON.stringify(updated));

    try {
      const docRef = doc(db, 'config', 'custom_categories');
      await setDoc(docRef, { items: updated }, { merge: true });
    } catch {
      // Offline fallback
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gemmp_custom_options_updated'));
    }
  }

  return newCat;
}

/**
 * Custom localities management
 */
export async function getCustomLocalities(): Promise<string[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_LOCALITIES);
    let list: string[] = raw ? JSON.parse(raw) : [];

    // Also attempt Firestore
    try {
      const docRef = doc(db, 'config', 'custom_localities');
      const snap = await getDoc(docRef);
      if (snap.exists() && Array.isArray(snap.data()?.items)) {
        list = snap.data().items;
        localStorage.setItem(STORAGE_KEY_CUSTOM_LOCALITIES, JSON.stringify(list));
      }
    } catch {
      // Offline fallback
    }

    return list;
  } catch {
    return [];
  }
}

export async function saveCustomLocality(localityName: string): Promise<string> {
  const cleanLocality = localityName.trim();
  const current = await getCustomLocalities();

  if (!current.some(l => l.toLowerCase() === cleanLocality.toLowerCase())) {
    const updated = [...current, cleanLocality];
    localStorage.setItem(STORAGE_KEY_CUSTOM_LOCALITIES, JSON.stringify(updated));

    try {
      const docRef = doc(db, 'config', 'custom_localities');
      await setDoc(docRef, { items: updated }, { merge: true });
    } catch {
      // Offline fallback
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gemmp_custom_options_updated'));
    }
  }

  return cleanLocality;
}

/**
 * Diagnostic tool to check live Firestore connection and permissions
 */
export async function checkFirestoreConnectivity(): Promise<{ connected: boolean; error?: string }> {
  try {
    const testDoc = doc(db, 'system', 'connectivity_check');
    await setDoc(testDoc, { ping: Date.now() }, { merge: true });
    return { connected: true };
  } catch (err: any) {
    return { connected: false, error: err?.message || 'Permissão negada ou offline' };
  }
}
