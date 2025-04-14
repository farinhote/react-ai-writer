import { useState } from 'react';
import axios from 'axios';
import { AiAction } from '../types';

export const useAiActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [showAddActionForm, setShowAddActionForm] = useState(false);
  const [newAction, setNewAction] = useState<AiAction>({ action: '', description: '' });
  
  // Default AI actions
  const [aiActions, setAiActions] = useState<AiAction[]>([
    { action: "simplify", description: "Make it clearer and more concise while preserving the meaning." },
    { action: "rewrite", description: "Rewrite the text with different words while keeping the same meaning." },
    { action: "enhance", description: "Improve the text with better vocabulary and clearer structure." },
    { action: "formalize", description: "Make the text more formal and professional." }
  ]);

  // Add a new AI action
  const addAiAction = () => {
    if (newAction.action && newAction.description) {
      setAiActions([...aiActions, newAction]);
      setNewAction({ action: '', description: '' });
      setShowAddActionForm(false);
    }
  };

  // AI action function
  const doAiAction = async (
    text: string, 
    action: string, 
    description: string,
    markdown: string,
    expandSelectionToWholeWords: (text: string, start: number, end: number) => { start: number, end: number, text: string },
    setMarkdown: (value: string) => void
  ) => {
    if (!text) return;
    
    try {
      setIsProcessing(true);
      setProcessingMessage('Your text is being expertly crafted...');
      
      // Get original selection position in markdown
      const selectionStart = markdown.indexOf(text);
      if (selectionStart === -1) {
        console.error("Selected text not found in markdown content");
        setIsProcessing(false);
        return;
      }
      
      // Original selection endpoints
      const selectionEnd = selectionStart + text.length;
      
      // Expand selection to whole words
      const expandedSelection = expandSelectionToWholeWords(markdown, selectionStart, selectionEnd);
      
      // Use expanded selection for processing
      const expandedStart = expandedSelection.start;
      const expandedEnd = expandedSelection.end;
      const expandedText = expandedSelection.text;
      
      // Get context around the expanded selection (200 characters before and after)
      const contextStart = Math.max(0, expandedStart - 200);
      const contextEnd = Math.min(markdown.length, expandedEnd + 200);
      
      const beforeContext = markdown.substring(contextStart, expandedStart);
      const afterContext = markdown.substring(expandedEnd, contextEnd);
      
      // Call backend to process text
      const response = await axios.post('http://localhost:5000/api/ai/process', {
        text: expandedText,
        action,
        description,
        contextBefore: beforeContext,
        contextAfter: afterContext
      });
      
      const processedText = response.data.processedText;
      
      // Replace the expanded text with processed text
      const beforeSelection = markdown.substring(0, expandedStart);
      const afterSelection = markdown.substring(expandedEnd);
      const newText = `${beforeSelection}${processedText}${afterSelection}`;
      
      setMarkdown(newText);
      setIsProcessing(false);
      setProcessingMessage('');
      
    } catch (error) {
      console.error('Error calling AI service:', error);
      setIsProcessing(false);
      setProcessingMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    isProcessing,
    processingMessage,
    showAddActionForm,
    newAction,
    aiActions,
    setShowAddActionForm,
    setNewAction,
    addAiAction,
    doAiAction
  };
};

export default useAiActions;