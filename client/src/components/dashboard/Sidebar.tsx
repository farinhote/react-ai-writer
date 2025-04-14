import React from 'react';

interface File {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface SidebarProps {
  files: File[];
  activeFile: File | null;
  setActiveFile: (file: File) => void;
  setShowCreateModal: (show: boolean) => void;
  deleteFile: (fileId: number) => void;
  logout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  files, 
  activeFile, 
  setActiveFile, 
  setShowCreateModal, 
  deleteFile,
  logout 
}) => {
  return (
    <div className="sidebar">
      <div className="files-list">
        <h2>
          My Files
          <button onClick={() => setShowCreateModal(true)}>+ New</button>
        </h2>
        
        {files.length === 0 ? (
          <p>No files yet. Create your first file!</p>
        ) : (
          files.map(file => (
            <div 
              key={file.id}
              className={`file-item ${activeFile && activeFile.id === file.id ? 'active' : ''}`}
              onClick={() => setActiveFile(file)}
            >
              <div className="file-title">{file.title}</div>
              <div className="file-actions">
                <button onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button onClick={logout} style={{ marginTop: '20px', width: '100%' }}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;