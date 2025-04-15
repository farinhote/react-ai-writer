import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './AiSuggestionDialog.css';

interface AiSuggestionDialogProps {
  isVisible: boolean;
  originalText: string;
  suggestedText: string;
  onAccept: () => void;
  onReject: () => void;
  action: string;
}

const AiSuggestionDialog: React.FC<AiSuggestionDialogProps> = ({
  isVisible,
  originalText,
  suggestedText,
  onAccept,
  onReject,
  action
}) => {
  const { isDarkMode } = useTheme();
  
  if (!isVisible) return null;

  return (
    <div className="ai-suggestion-dialog">
      <div className="ai-suggestion-content">
        <h3>AI Suggestion: {action}</h3>
        
        <div className="comparison-container">
          <div className="text-column">
            <h4>Original Text</h4>
            <div className="text-box original">
              {originalText}
            </div>
          </div>
          
          <div className="text-column">
            <h4>Suggested Change</h4>
            <div className="text-box suggested">
              {suggestedText}
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="reject-button" onClick={onReject}>
            Reject
          </button>
          <button className="accept-button" onClick={onAccept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiSuggestionDialog;