import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { Send, Bot, User, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onReset: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  input, 
  setInput, 
  onSend, 
  isLoading,
  onReset
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                <Bot size={24} />
            </div>
            <div>
                <h1 className="font-bold text-slate-800 text-lg leading-tight">Atendimento Virtual</h1>
                <p className="text-xs text-slate-500">Especialista em Regimentos e Convenções</p>
            </div>
        </div>
        <button 
            onClick={onReset}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors"
            title="Reiniciar conversa"
        >
            <RotateCcw size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <Bot size={48} className="mb-4" />
                <p className="text-sm">Inicie a conversa informando seu condomínio.</p>
            </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm
                    ${msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-blue-600 text-white'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div
                    className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap
                    ${msg.role === 'user' 
                        ? 'bg-slate-700 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}
                >
                    {msg.role === 'model' ? (
                        <div className="markdown-body">
                             <ReactMarkdown components={{
                                 strong: ({node, ...props}) => <span className="font-bold text-blue-700" {...props} />,
                                 ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                                 li: ({node, ...props}) => <li className="pl-1" {...props} />
                             }}>
                                {msg.text}
                             </ReactMarkdown>
                        </div>
                    ) : (
                        msg.text
                    )}
                </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="flex flex-row gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} />
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t">
        <div className="relative flex items-center bg-slate-100 rounded-xl border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua dúvida sobre o condomínio..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 pl-4 pr-12 max-h-32 min-h-[50px] text-sm text-slate-800 placeholder-slate-400"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-center mt-2">
             <p className="text-[10px] text-slate-400">As respostas são geradas com base nos documentos fornecidos. Consulte um advogado para análises jurídicas.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
