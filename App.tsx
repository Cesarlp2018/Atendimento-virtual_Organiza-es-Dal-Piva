import React, { useState, useEffect } from 'react';
import { Settings, MessageSquare, AlertCircle } from 'lucide-react';
import { Message, CondoDocument } from './types';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import ChatInterface from './components/ChatInterface';
import DocumentPanel from './components/DocumentPanel';

const DOCS_STORAGE_KEY = 'condoai_documents';

const App: React.FC = () => {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Document Management State with Persistence
  const [documents, setDocuments] = useState<CondoDocument[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(DOCS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error("Error loading documents from local storage:", error);
        return [];
      }
    }
    return [];
  });

  const [isDocPanelOpen, setIsDocPanelOpen] = useState(false);
  const [needsChatReset, setNeedsChatReset] = useState(false);

  // Persist documents whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(documents));
    } catch (error) {
       console.error("Error saving documents to local storage:", error);
    }
  }, [documents]);

  // Initialize Chat when documents change (or on mount)
  useEffect(() => {
    try {
      initializeChat(documents);
    } catch (e) {
      console.error("Failed to init chat", e);
    }
  }, []); 

  // Handle Document Updates
  const handleDocumentsUpdated = () => {
    // When docs update, we need to re-initialize the chat session with new system prompt
    setNeedsChatReset(true);
  };

  const reinitializeSession = () => {
    initializeChat(documents);
    setMessages([]); // Clear history to avoid context confusion
    setNeedsChatReset(false);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    if (needsChatReset) {
        reinitializeSession();
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(inputText);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Desculpe, ocorreu um erro ao processar sua mensagem. Verifique sua conexão ou a Chave de API.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
      setMessages([]);
      initializeChat(documents);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative">
      {/* Sidebar / Main Layout Wrapper */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full h-full shadow-2xl bg-white md:my-4 md:rounded-2xl overflow-hidden">
        
        {/* App Bar */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
                <MessageSquare className="text-blue-400" />
                <span className="font-bold text-lg tracking-tight">CondoAI</span>
            </div>
            
            <button 
                onClick={() => setIsDocPanelOpen(true)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors text-sm border border-slate-700"
            >
                <Settings size={16} />
                <span className="hidden sm:inline">Gerenciar Documentos</span>
                {documents.length > 0 && (
                    <span className="bg-blue-500 text-[10px] px-1.5 rounded-full">{documents.length}</span>
                )}
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
            <ChatInterface 
                messages={messages}
                input={inputText}
                setInput={setInputText}
                onSend={handleSendMessage}
                isLoading={isLoading}
                onReset={handleReset}
            />

            {/* Notification if documents changed */}
            {needsChatReset && messages.length > 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full shadow-md text-sm flex items-center gap-2 z-20 border border-amber-200 animate-fade-in-down">
                    <AlertCircle size={16} />
                    <span>Documentos atualizados. A conversa será reiniciada na próxima mensagem.</span>
                </div>
            )}
        </div>
      </div>

      {/* Document Management Slide-over */}
      <DocumentPanel 
        documents={documents}
        setDocuments={setDocuments}
        isOpen={isDocPanelOpen}
        onClose={() => setIsDocPanelOpen(false)}
        onDocumentsUpdated={handleDocumentsUpdated}
      />
    </div>
  );
};

export default App;