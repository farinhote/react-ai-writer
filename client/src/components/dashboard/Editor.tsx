import React, { useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';

interface EditorProps {
  activeFile: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  markdown: string;
  setMarkdown: (value: string) => void;
  isSaving: boolean;
  handleContextMenu: (e: React.MouseEvent) => void;
}

const Editor: React.FC<EditorProps> = ({
  activeFile,
  markdown,
  setMarkdown,
  isSaving,
  handleContextMenu,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: '20px' }}>
        {activeFile ? activeFile.title : 'No File Selected'}
        {isSaving && <span style={{ fontSize: '14px', marginLeft: '10px', color: '#888' }}>Saving...</span>}
      </h1>
      
      {activeFile && (
        <div 
          className="editor-container" 
          ref={editorRef}
          onContextMenu={handleContextMenu}
        >
          <MDEditor
            value={markdown}
            onChange={(value) => setMarkdown(value || '')}
            height={600}
          />
        </div>
      )}
    </div>
  );
};

export default Editor;