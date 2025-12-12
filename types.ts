export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CondoDocument {
  id: string;
  name: string; // e.g., "Condomínio Solar"
  content: string; // The full text of the Regimento/Convenção
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
