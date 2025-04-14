import { useState, useEffect } from 'react';

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');

  // Utility function to expand selection to whole words
  const expandSelectionToWholeWords = (text: string, selectionStart: number, selectionEnd: number) => {
    // Expand selection start to include the whole word
    let expandedStart = selectionStart;
    while (expandedStart > 0 &&
      !(/\s/.test(text[expandedStart - 1]) || /[\n\r]/.test(text[expandedStart - 1]))) {
      expandedStart--;
    }
    
    // Expand selection end to include the whole word
    let expandedEnd = selectionEnd;
    while (expandedEnd < text.length &&
      !(/\s/.test(text[expandedEnd]) || /[\n\r]/.test(text[expandedEnd]))) {
      expandedEnd++;
    }
    
    return {
      start: expandedStart,
      end: expandedEnd,
      text: text.substring(expandedStart, expandedEnd)
    };
  };

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent, searchWithJina: (text: string) => void) => {
    e.preventDefault();
    
    // Get selected text
    const selection = window.getSelection()?.toString() || '';
    if (selection) {
      setSelectedText(selection);
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY
      });
      
      // Trigger Jina AI search automatically
      searchWithJina(selection);
    }
  };

  // Handle action on selected text
  const handleSelectedTextAction = (
    action: string, 
    markdown: string, 
    setMarkdown: (value: string) => void
  ) => {
    // Get cursor position/selection
    const selectionStart = markdown.indexOf(selectedText);
    if (selectionStart === -1) {
      console.error("Selected text not found in markdown content");
      setContextMenu({ ...contextMenu, visible: false });
      return;
    }
    
    const selectionEnd = selectionStart + selectedText.length;
    
    const expandedSelection = expandSelectionToWholeWords(markdown, selectionStart, selectionEnd);
    const expandedStart = expandedSelection.start;
    const expandedEnd = expandedSelection.end;
    const expandedText = expandedSelection.text;
    
    const beforeSelection = markdown.substring(0, expandedStart);
    const afterSelection = markdown.substring(expandedEnd);
    
    let newText;
    
    // Local text changes
    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(expandedText);
        setContextMenu({ ...contextMenu, visible: false });
        return;
        
      case 'bold':
        newText = `${beforeSelection}**${expandedText}**${afterSelection}`;
        break;
        
      case 'italic':
        newText = `${beforeSelection}_${expandedText}_${afterSelection}`;
        break;
        
      case 'highlight':
        newText = `${beforeSelection}\`${expandedText}\`${afterSelection}`;
        break;
        
      case 'custom':
        newText = `${beforeSelection}[${expandedText}](link)${afterSelection}`;
        break;
        
      default:
        newText = markdown;
    }
    
    // Update the markdown content
    setMarkdown(newText);
    
    // Hide the context menu
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Add reference to selected text
  const addReferenceToText = (
    url: string, 
    title: string,
    markdown: string,
    setMarkdown: (value: string) => void,
    selectedReferences: string[],
    setSelectedReferences: (refs: string[]) => void,
    setShowReferencesSubmenu: (show: boolean) => void
  ) => {
    // Get cursor position/selection
    const selectionStart = markdown.indexOf(selectedText);
    if (selectionStart === -1) {
      console.error("Selected text not found in markdown content");
      return;
    }
    
    const selectionEnd = selectionStart + selectedText.length;
    
    // Get expanded selection
    const expandedSelection = expandSelectionToWholeWords(markdown, selectionStart, selectionEnd);
    const expandedStart = expandedSelection.start;
    const expandedEnd = expandedSelection.end;
    const expandedText = expandedSelection.text;
    
    const beforeSelection = markdown.substring(0, expandedStart);
    const afterSelection = markdown.substring(expandedEnd);
    
    // Create link with reference using markdown format
    const newText = `${beforeSelection}[${expandedText}](${url})${afterSelection}`;
    
    // Update the markdown content
    setMarkdown(newText);
    
    // Add to selected references
    if (!selectedReferences.includes(url)) {
      setSelectedReferences([...selectedReferences, url]);
    }
    
    // Hide reference submenu and context menu
    setShowReferencesSubmenu(false);
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Hide context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ ...contextMenu, visible: false });
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  return {
    contextMenu,
    selectedText,
    setContextMenu,
    setSelectedText,
    handleContextMenu,
    handleSelectedTextAction,
    addReferenceToText,
    expandSelectionToWholeWords
  };
};

export default useContextMenu;