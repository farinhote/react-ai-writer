import React from 'react';

interface ProcessingOverlayProps {
  isProcessing: boolean;
  processingMessage: string;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  isProcessing,
  processingMessage
}) => {
  if (!isProcessing) return null;

  return (
    <div className="processing-overlay">
      <div className="processing-content">
        <div className="spinner"></div>
        <p>{processingMessage}</p>
      </div>
    </div>
  );
};

export default ProcessingOverlay;