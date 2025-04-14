import React from 'react';

interface JinaSearchResult {
  url: string;
  title: string;
  description: string;
  date?: string;
}

interface ReferencesSubmenuProps {
  jinaSearchResults: JinaSearchResult[];
  referencesSubmenuPosition: {
    x: number;
    y: number;
  };
  selectedReferences: string[];
  addReferenceToText: (url: string, title: string) => void;
  setShowReferencesSubmenu: (show: boolean) => void;
}

const ReferencesSubmenu: React.FC<ReferencesSubmenuProps> = ({
  jinaSearchResults,
  referencesSubmenuPosition,
  selectedReferences,
  addReferenceToText,
  setShowReferencesSubmenu
}) => {
  return (
    <div 
      className="references-submenu"
      style={{
        position: 'fixed',
        top: `${referencesSubmenuPosition.y}px`,
        left: `${referencesSubmenuPosition.x}px`,
        maxHeight: '400px',
        overflowY: 'auto',
        width: '400px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '4px',
        zIndex: 1000
      }}
      onMouseEnter={() => setShowReferencesSubmenu(true)}
      onMouseLeave={() => setShowReferencesSubmenu(false)}
    >
      <ul style={{ listStyle: 'none', padding: '10px', margin: 0 }}>
        {Array.isArray(jinaSearchResults) && jinaSearchResults.length > 0 ? (
          jinaSearchResults.map((result, index) => (
            <li key={index} className="reference-item" style={{ 
              padding: '10px', 
              borderBottom: '1px solid #eee', 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              cursor: 'pointer'
            }}
            onClick={() => addReferenceToText(result.url, result.title)}>
              <div className="reference-info" style={{ flex: 1, marginRight: '10px' }}>
                <div className="reference-title" style={{ fontWeight: 'bold', marginBottom: '4px' }}>{result.title}</div>
                <div className="reference-url" style={{ fontSize: '12px', color: '#2a7ae2', marginBottom: '4px' }}>{result.url}</div>
                <div className="reference-description" style={{ fontSize: '13px', color: '#555' }}>{result.description}</div>
                {result.date && <div className="reference-date" style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{result.date}</div>}
              </div>
              <div className="add-reference-button" style={{ 
                minWidth: '40px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: '#2a7ae2',
                fontWeight: 'bold'
              }}>
                Add
              </div>
            </li>
          ))
        ) : (
          <li className="reference-item" style={{ padding: '10px' }}>No results found</li>
        )}
      </ul>
    </div>
  );
};

export default ReferencesSubmenu;