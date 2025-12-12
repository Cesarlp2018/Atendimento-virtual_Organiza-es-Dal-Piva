import { GoogleGenAI, Chat } from "@google/genai";
import { Message, CondoDocument } from '../types';
import { SYSTEM_PROMPT_TEMPLATE } from '../constants';

let chatSession: Chat | null = null;
let currentDocuments: CondoDocument[] = [];

export const initializeChat = (documents: CondoDocument[]) => {
  // Store context for potential re-initialization
  currentDocuments = documents;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Construct the full system instruction with documents appended
  let fullSystemInstruction = SYSTEM_PROMPT_TEMPLATE;
  
  if (documents.length > 0) {
    documents.forEach(doc => {
      fullSystemInstruction += `\n\n=== INÍCIO DO DOCUMENTO: ${doc.name.toUpperCase()} ===\n${doc.content}\n=== FIM DO DOCUMENTO: ${doc.name.toUpperCase()} ===\n`;
    });
  } else {
    fullSystemInstruction += "\n\n[ALERTA DO SISTEMA: NENHUM DOCUMENTO DE CONDOMÍNIO FOI CARREGADO AINDA. SOLICITE AO USUÁRIO QUE O ADMINISTRADOR CARREGUE OS DOCUMENTOS.]";
  }

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: fullSystemInstruction,
      temperature: 0.2, // Low temperature for factual, document-based answers
    }
  });

  chatSession = chat;
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "Desculpe, não consegui processar sua solicitação.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const resetChat = () => {
    initializeChat(currentDocuments);
};