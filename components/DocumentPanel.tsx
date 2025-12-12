import React, { useState } from 'react';
import { CondoDocument } from '../types';
import { MOCK_DOCUMENT_CONTENT } from '../constants';
import { Book, Plus, Trash2, FileText, X } from 'lucide-react';

interface DocumentPanelProps {
  documents: CondoDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<CondoDocument[]>>;
  isOpen: boolean;
  onClose: () => void;
  onDocumentsUpdated: () => void;
}

const DocumentPanel: React.FC<DocumentPanelProps> = ({ 
  documents, 
  setDocuments, 
  isOpen, 
  onClose,
  onDocumentsUpdated
}) => {
  const [newDocName, setNewDocName] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddDocument = () => {
    if (!newDocName.trim() || !newDocContent.trim()) return;

    const newDoc: CondoDocument = {
      id: Date.now().toString(),
      name: newDocName,
      content: newDocContent
    };

    const updatedDocs = [...documents, newDoc];
    setDocuments(updatedDocs);
    setNewDocName('');
    setNewDocContent('');
    setIsAdding(false);
    onDocumentsUpdated();
  };

  const handleRemoveDocument = (id: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocs);
    onDocumentsUpdated();
  };

  const loadMockData = () => {
    setNewDocName('Horizonte Azul');
    setNewDocContent(MOCK_DOCUMENT_CONTENT);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-xl flex flex-col animate-slide-in-right">
        <div className="p-4 border-b flex justify-between items-center bg-slate-800 text-white">
          <h2 className="font-semibold flex items-center gap-2">
            <Book size={20} /> Base de Conhecimento
          </h2>
          <button onClick={onClose} className="hover:bg-slate-700 p-1 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
            Adicione os documentos (Regimento, Convenção) de cada condomínio aqui. 
            O assistente usará estes textos para responder às perguntas.
          </div>

          {/* List of existing documents */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-500 uppercase">Documentos Ativos ({documents.length})</h3>
            {documents.length === 0 && (
              <p className="text-slate-400 text-sm italic">Nenhum documento cadastrado.</p>
            )}
            {documents.map(doc => (
              <div key={doc.id} className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="flex items-center gap-2 mb-2">
                    <FileText size={18} className="text-slate-600" />
                    <span className="font-medium text-slate-900">{doc.name}</span>
                </div>
                <div className="text-xs text-slate-500 line-clamp-2 font-mono bg-slate-50 p-1 rounded">
                    {doc.content.substring(0, 100)}...
                </div>
                <button 
                  onClick={() => handleRemoveDocument(doc.id)}
                  className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover documento"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Document Form */}
          <div className="border-t pt-4">
            {!isAdding ? (
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-slate-500 hover:text-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={18} /> Adicionar Novo Documento
              </button>
            ) : (
              <div className="bg-slate-50 p-4 rounded-lg border space-y-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Condomínio</label>
                  <input 
                    type="text" 
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Ex: Condomínio Solar"
                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Conteúdo do Documento</label>
                    <button onClick={loadMockData} className="text-xs text-blue-600 hover:underline">
                        Usar exemplo
                    </button>
                  </div>
                  <textarea 
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                    placeholder="Cole aqui o texto do Regimento Interno, Convenção, etc."
                    className="w-full px-3 py-2 border rounded text-sm h-40 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddDocument}
                    className="flex-1 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Salvar Documento
                  </button>
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 border bg-white rounded text-sm hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPanel;
