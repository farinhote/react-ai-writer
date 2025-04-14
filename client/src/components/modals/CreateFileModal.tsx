import React from 'react';

interface CreateFileModalProps {
  showCreateModal: boolean;
  newFileName: string;
  setNewFileName: (name: string) => void;
  setShowCreateModal: (show: boolean) => void;
  createFile: () => void;
}

const CreateFileModal: React.FC<CreateFileModalProps> = ({
  showCreateModal,
  newFileName,
  setNewFileName,
  setShowCreateModal,
  createFile
}) => {
  if (!showCreateModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New File</h2>
        <form className="create-file-form" onSubmit={(e) => { e.preventDefault(); createFile(); }}>
          <input
            type="text"
            placeholder="File name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            autoFocus
          />
          <div className="form-actions">
            <button type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFileModal;