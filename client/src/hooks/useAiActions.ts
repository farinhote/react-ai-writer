import { useState } from 'react';
import axios from 'axios';
import { AiAction } from '../types';

interface SuggestionData {
  originalText: string;
  suggestedText: string;
  expandedStart: number;
  expandedEnd: number;
  markdown: string;
  setMarkdown: (value: string) => void;
  action: string;
}

export const useAiActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [showAddActionForm, setShowAddActionForm] = useState(false);
  const [newAction, setNewAction] = useState<AiAction>({ action: '', description: '' });
  
  // State for suggestion confirmation
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<SuggestionData | null>(null);

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

  // Accept the current suggestion
  const acceptSuggestion = () => {
    if (!currentSuggestion) return;
    
    const { suggestedText, expandedStart, expandedEnd, markdown, setMarkdown } = currentSuggestion;
    
    // Apply suggestion
    const beforeSelection = markdown.substring(0, expandedStart);
    const afterSelection = markdown.substring(expandedEnd);
    const newText = `${beforeSelection}${suggestedText}${afterSelection}`;
    
    setMarkdown(newText);
    setShowSuggestion(false);
    setCurrentSuggestion(null);
  };
  
  // Reject the current suggestion
  const rejectSuggestion = () => {
    setShowSuggestion(false);
    setCurrentSuggestion(null);
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

      // Call backend to process text using environment variable
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${API_URL}/ai/process`, {
        text: expandedText,
        action,
        description,
        contextBefore: beforeContext,
        contextAfter: afterContext
      });

      // Check if the request was successful
      if (!response.data.success) {
        // Handle content policy violation or other issues
        const errorMessage = response.data.content || 'AI processing failed due to content policy violation';
        console.error('AI processing unsuccessful:', errorMessage);
        setProcessingMessage(`Error: ${errorMessage}`);
        setIsProcessing(false);
        return; // Exit early
      }

      let processedText = response.data.processedText;

      // Preserve whitespace by examining the original text
      const originalText = markdown.substring(expandedStart, expandedEnd);

      const originalLeadingWhitespace = originalText.match(/^(\s+)/)?.[0] || '';
      const originalTrailingWhitespace = originalText.match(/(\s+)$/)?.[0] || '';

      // If original text had leading or trailing whitespace, ensure processed text keeps it
      if (originalLeadingWhitespace && !processedText.startsWith(originalLeadingWhitespace)) {
        processedText = originalLeadingWhitespace + processedText.replace(/^\s*/, '');
      }
      if (originalTrailingWhitespace && !processedText.endsWith(originalTrailingWhitespace)) {
        processedText = processedText.replace(/\s*$/, '') + originalTrailingWhitespace;
      }

      // Instead of directly applying changes, show confirmation dialog
      setCurrentSuggestion({
        originalText: expandedText,
        suggestedText: processedText,
        expandedStart,
        expandedEnd,
        markdown,
        setMarkdown,
        action
      });
      
      setShowSuggestion(true);
      setIsProcessing(false);
      setProcessingMessage('');

    } catch (error) {
      console.error('Error calling AI service:', error);
      setIsProcessing(false);
      
      // Check if this is an axios error with a response
      if (axios.isAxiosError(error) && error.response?.data) {
        const responseData = error.response.data;
        
        // If we have a structured error response with content
        if (responseData && responseData.content) {
          setProcessingMessage(`Error: ${responseData.content}`);
        } else if (error.response.status === 422) {
          setProcessingMessage('Error: Content policy violation');
        } else {
          setProcessingMessage(`Error: ${error.message}`);
        }
      } else {
        setProcessingMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  return {
    isProcessing,
    processingMessage,
    showAddActionForm,
    newAction,
    aiActions,
    showSuggestion,
    currentSuggestion,
    setShowAddActionForm,
    setNewAction,
    addAiAction,
    doAiAction,
    acceptSuggestion,
    rejectSuggestion
  };
};

export default useAiActions;