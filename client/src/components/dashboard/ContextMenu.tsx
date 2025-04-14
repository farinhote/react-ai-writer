import React from 'react';
import ReferencesSubmenu from './ReferencesSubmenu';

interface JinaSearchResult {
  url: string;
  title: string;
  description: string;
  date?: string;
}

interface AiAction {
  action: string;
  description: string;
}

interface ContextMenuProps {
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
  };
  isJinaSearching: boolean;
  jinaSearchResults: JinaSearchResult[];
  showReferencesSubmenu: boolean;
  setShowReferencesSubmenu: (show: boolean) => void;
  referencesSubmenuPosition: {
    x: number;
    y: number;
  };
  selectedReferences: string[];
  handleSelectedTextAction: (action: string) => void;
  handleReferencesHover: (e: React.MouseEvent) => void;
  handleReferencesLeave: () => void;
  addReferenceToText: (url: string, title: string) => void;
  aiActions: AiAction[];
  selectedText: string;
  doAiAction: (text: string, action: string, description: string) => void;
  setShowAddActionForm: (show: boolean) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  contextMenu,
  isJinaSearching,
  jinaSearchResults,
  showReferencesSubmenu,
  setShowReferencesSubmenu,
  referencesSubmenuPosition,
  selectedReferences,
  handleSelectedTextAction,
  handleReferencesHover,
  handleReferencesLeave,
  addReferenceToText,
  aiActions,
  selectedText,
  doAiAction,
  setShowAddActionForm
}) => {
  if (!contextMenu.visible) return null;

  return (
    <div
      className="context-menu"
      style={{
        position: 'fixed',
        top: `${contextMenu.y}px`,
        left: `${contextMenu.x}px`,
      }}
    >
      <ul>
        {/* Standard text formatting actions */}
        <li onClick={() => handleSelectedTextAction('copy')}>Copy</li>
        <li onClick={() => handleSelectedTextAction('bold')}>Make Bold</li>
        <li onClick={() => handleSelectedTextAction('italic')}>Make Italic</li>
        <li onClick={() => handleSelectedTextAction('highlight')}>Code Highlight</li>
        
        {/* References option with submenu */}
        <li 
          className="references-option"
          onMouseEnter={handleReferencesHover}
          onMouseLeave={handleReferencesLeave}
        >
          Add Reference
          {isJinaSearching && <span className="searching-indicator"> (searching...)</span>}
          
          {/* References submenu */}
          {showReferencesSubmenu && Array.isArray(jinaSearchResults) && (
            <ReferencesSubmenu 
              jinaSearchResults={jinaSearchResults}
              referencesSubmenuPosition={referencesSubmenuPosition}
              selectedReferences={selectedReferences}
              addReferenceToText={addReferenceToText}
              setShowReferencesSubmenu={setShowReferencesSubmenu}
            />
          )}
        </li>
        
        <li onClick={() => handleSelectedTextAction('custom')}>Add Custom Link</li>
        
        {/* Dynamically generated AI actions */}
        {aiActions.map((aiAction, index) => (
          <li
            key={index}
            className="ai-action"
            onClick={() => doAiAction(selectedText, aiAction.action, aiAction.description)}
          >
            {aiAction.action.charAt(0).toUpperCase() + aiAction.action.slice(1)}
          </li>
        ))}
        <li className="ai-action" onClick={() => setShowAddActionForm(true)}>Add Custom AI Action</li>
      </ul>
    </div>
  );
};

export default ContextMenu;