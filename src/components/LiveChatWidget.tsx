import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Building2, 
  MessageCircle, 
  Phone, 
  Check, 
  Sparkles,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import type { ChatMessage, PropertyItem } from '../types';
import { subscribeToMessages, sendChatMessage } from '../lib/firebase';
import { COMPANY_INFO, buildWhatsAppLink } from '../lib/constants';

interface LiveChatWidgetProps {
  attachedProperty?: PropertyItem | null;
  onClearAttachedProperty?: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  attachedProperty,
  onClearAttachedProperty,
  isOpen,
  onToggleOpen,
}) => {
  const [clientName, setClientName] = useState(() => {
    return localStorage.getItem('gemmp_client_name') || '';
  });
  const [clientPhone, setClientPhone] = useState(() => {
    return localStorage.getItem('gemmp_client_phone') || '';
  });
  const [hasStarted, setHasStarted] = useState(() => {
    return Boolean(localStorage.getItem('gemmp_chat_conversation_id') && localStorage.getItem('gemmp_client_name'));
  });

  const [conversationId] = useState<string>(() => {
    let existing = localStorage.getItem('gemmp_chat_conversation_id');
    if (!existing) {
      existing = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('gemmp_chat_conversation_id', existing);
    }
    return existing;
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time messages for this user's private conversation
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = subscribeToMessages(conversationId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [conversationId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    localStorage.setItem('gemmp_client_name', clientName);
    localStorage.setItem('gemmp_client_phone', clientPhone);
    localStorage.setItem('gemmp_chat_conversation_id', conversationId);
    setHasStarted(true);

    // Send automated welcome message from Gemmp
    sendChatMessage(conversationId, {
      conversationId,
      sender: 'admin',
      clientName: 'Gemmp Construção & Imobiliária (Assistente)',
      text: `Olá, ${clientName}! Seja bem-vindo à Gemmp. Estamos à disposição para tirar dúvidas sobre lotes, vivendas no Kilamba/Futungo ou orçamentos de obras. Em que podemos lhe ajudar agora?`,
      isRead: true,
    });

    // If there is an attached property, send an initial inquiry for it
    if (attachedProperty) {
      sendChatMessage(conversationId, {
        conversationId,
        sender: 'client',
        clientName,
        clientPhone,
        text: `Gostaria de obter mais informações sobre o imóvel: "${attachedProperty.title}".`,
        propertyId: attachedProperty.id,
        propertyTitle: attachedProperty.title,
        isRead: false,
      });
      if (onClearAttachedProperty) onClearAttachedProperty();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    await sendChatMessage(conversationId, {
      conversationId,
      sender: 'client',
      clientName: clientName || 'Cliente Gemmp',
      clientPhone,
      text: textToSend,
      ...(attachedProperty ? { propertyId: attachedProperty.id, propertyTitle: attachedProperty.title } : {}),
      isRead: false,
    });

    if (attachedProperty && onClearAttachedProperty) {
      onClearAttachedProperty();
    }
  };

  const sendQuickOption = (text: string) => {
    if (!hasStarted) {
      setInputText(text);
      return;
    }
    sendChatMessage(conversationId, {
      conversationId,
      sender: 'client',
      clientName: clientName || 'Cliente Gemmp',
      clientPhone,
      text,
      isRead: false,
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={onToggleOpen}
          className="relative group p-3.5 sm:p-4 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center border-2 border-slate-950 cursor-pointer"
          aria-label="Abrir Assistência em Tempo Real"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>

          {isOpen ? (
            <X className="w-6 h-6 text-slate-950" />
          ) : (
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-slate-950 fill-slate-950" />
              <span className="hidden sm:inline text-xs font-black tracking-tight text-slate-950 pr-1">
                Chat ao Vivo
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] md:w-[420px] bg-white rounded-3xl shadow-2xl border-2 border-amber-500 overflow-hidden flex flex-col h-[550px] max-h-[80vh] animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Header */}
          <div className="bg-slate-950 text-white p-4 border-b-2 border-amber-500 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Building2 className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full"></span>
              </div>
              <div>
                <h4 className="text-sm font-black text-white font-heading">
                  Assistência Gemmp (Online)
                </h4>
                <p className="text-[11px] text-amber-400 font-medium">
                  Kilamba & Futungo • Resposta Rápida
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                title="Migrar para WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
              </a>
              <button
                onClick={onToggleOpen}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Attached Property Card Preview if User Came From a Specific Listing */}
          {attachedProperty && (
            <div className="bg-amber-500/15 border-b border-amber-500/30 p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 truncate">
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                  Imóvel Selecionado
                </span>
                <span className="font-bold text-slate-900 truncate">
                  {attachedProperty.title}
                </span>
              </div>
              {onClearAttachedProperty && (
                <button
                  onClick={onClearAttachedProperty}
                  className="text-slate-400 hover:text-rose-600 ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Chat Body: Registration Form or Conversation */}
          {!hasStarted ? (
            <div className="flex-1 p-6 flex flex-col justify-center space-y-4 bg-slate-50">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h5 className="font-extrabold text-slate-900 text-base font-heading">
                  Iniciar Atendimento em Tempo Real
                </h5>
                <p className="text-xs text-slate-600">
                  Informe seu nome e WhatsApp para que nossa equipe técnica possa registar a sua conversa e responder diretamente.
                </p>
              </div>

              <form onSubmit={handleStartChat} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seu Nome Completo:
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Manuel dos Santos"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp ou Telefone em Angola:
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ex: +244 935 973 494"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-colors flex items-center justify-center cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  Iniciar Conversa com a Gemmp
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {/* Reception Banner */}
                <div className="text-center my-1">
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-medium">
                    Atendimento Privado & Criptografado
                  </span>
                </div>

                {messages.map((msg) => {
                  const isClient = msg.sender === 'client';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                          isClient
                            ? 'bg-amber-500 text-slate-950 rounded-br-none font-medium'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                        }`}
                      >
                        {!isClient && (
                          <span className="block text-[10px] font-black text-amber-600 mb-0.5">
                            Gemmp Construção
                          </span>
                        )}
                        {msg.propertyTitle && (
                          <div className="mb-1 p-1.5 bg-slate-950/10 rounded text-[11px] font-bold">
                            📌 Ref: {msg.propertyTitle}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-slate-600/80">
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isClient && <CheckCheck className="w-3 h-3 text-slate-900" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-3 py-1.5 bg-amber-50/70 border-t border-amber-200 flex gap-1.5 overflow-x-auto scrollbar-thin">
                <button
                  onClick={() => sendQuickOption('Gostaria de agendar uma visita a um imóvel no Kilamba.')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-800 text-[10px] font-bold rounded-full border border-amber-300 whitespace-nowrap shrink-0"
                >
                  📅 Visita no Kilamba
                </button>
                <button
                  onClick={() => sendQuickOption('Quero saber valores de lotes e terrenos no Futungo de Belas.')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-800 text-[10px] font-bold rounded-full border border-amber-300 whitespace-nowrap shrink-0"
                >
                  📍 Lotes no Futungo
                </button>
                <button
                  onClick={() => sendQuickOption('Preciso de um orçamento para construção civil de vivenda.')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-800 text-[10px] font-bold rounded-full border border-amber-300 whitespace-nowrap shrink-0"
                >
                  🏗️ Orçamento de Obra
                </button>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escreva a sua mensagem..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-100 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow transition-colors cursor-pointer"
                  title="Enviar mensagem"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

        </div>
      )}
    </>
  );
};
