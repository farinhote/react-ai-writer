export interface File {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface JinaSearchResult {
  url: string;
  title: string;
  description: string;
  date?: string;
}

export interface JinaReadResult {
  url: string;
  title: string;
  content: string;
  timestamp?: string;
}

export interface AiAction {
  action: string;
  description: string;
}