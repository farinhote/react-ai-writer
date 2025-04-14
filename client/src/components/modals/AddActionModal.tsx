import React from 'react';

interface AddActionModalProps {
  showAddActionForm: boolean;
  newAction: { action: string; description: string };
  setNewAction: (action: { action: string; description: string }) => void;
  setShowAddActionForm: (show: boolean) => void;
  addAiAction: () => void;
}

const AddActionModal: React.FC<AddActionModalProps> = ({
  showAddActionForm,
  newAction,
  setNewAction,
  setShowAddActionForm,
  addAiAction
}) => {
  if (!showAddActionForm) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Custom AI Action</h2>
        <form onSubmit={(e) => { e.preventDefault(); addAiAction(); }}>
          <div className="form-group">
            <label htmlFor="action-name">Action Name:</label>
            <input
              id="action-name"
              type="text"
              placeholder="e.g., summarize, expand, translate"
              value={newAction.action}
              onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="action-description">Instructions:</label>
            <textarea
              id="action-description"
              placeholder="Describe how the AI should process the text..."
              value={newAction.description}
              onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => setShowAddActionForm(false)}>Cancel</button>
            <button type="submit">Add Action</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActionModal;