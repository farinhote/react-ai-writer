import React from 'react';
import { useAuth } from '../context/AuthContext';

// Import custom hooks
import useFiles from '../hooks/useFiles';
import useJinaSearch from '../hooks/useJinaSearch';
import useAiActions from '../hooks/useAiActions';
import useContextMenu from '../hooks/useContextMenu';

// Import components
import Sidebar from '../components/dashboard/Sidebar';
import Editor from '../components/dashboard/Editor';
import ContextMenu from '../components/dashboard/ContextMenu';
import ProcessingOverlay from '../components/dashboard/ProcessingOverlay';
import CreateFileModal from '../components/modals/CreateFileModal';
import AddActionModal from '../components/modals/AddActionModal';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  
  // Use custom hooks to manage different parts of the application
  const {
    files,
    activeFile,
    markdown,
    isSaving,
    showCreateModal,
    newFileName,
    setActiveFile,
    setMarkdown,
    setShowCreateModal,
    setNewFileName,
    createFile,
    deleteFile
  } = useFiles();
  
  const {
    jinaSearchResults,
    isJinaSearching,
    showReferencesSubmenu,
    referencesSubmenuPosition,
    selectedReferences,
    setShowReferencesSubmenu,
    setSelectedReferences,
    searchWithJina,
    handleReferencesHover,
    handleReferencesLeave
  } = useJinaSearch();
  
  const {
    isProcessing,
    processingMessage,
    showAddActionForm,
    newAction,
    aiActions,
    setShowAddActionForm,
    setNewAction,
    addAiAction,
    doAiAction
  } = useAiActions();
  
  const {
    contextMenu,
    selectedText,
    setSelectedText,
    setContextMenu,
    expandSelectionToWholeWords,
    handleSelectedTextAction: baseHandleSelectedTextAction,
    addReferenceToText: baseAddReferenceToText
  } = useContextMenu();
  
  // Wrap handlers to provide required parameters
  const handleContextMenu = (e: React.MouseEvent) => {
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
  
  const handleSelectedTextAction = (action: string) => {
    if (!activeFile) return;
    baseHandleSelectedTextAction(action, markdown, setMarkdown);
  };
  
  const addReferenceToText = (url: string, title: string) => {
    if (!activeFile) return;
    baseAddReferenceToText(
      url, 
      title, 
      markdown, 
      setMarkdown, 
      selectedReferences, 
      setSelectedReferences, 
      setShowReferencesSubmenu
    );
  };
  
  const handleAiAction = (text: string, action: string, description: string) => {
    if (!activeFile) return;
    doAiAction(text, action, description, markdown, expandSelectionToWholeWords, setMarkdown);
  };
  
  return (
    <div className="dashboard-container">
      {/* Sidebar component */}
      <Sidebar
        files={files}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        setShowCreateModal={setShowCreateModal}
        deleteFile={deleteFile}
        logout={logout}
      />
      
      {/* Editor component */}
      <Editor
        activeFile={activeFile}
        markdown={markdown}
        setMarkdown={setMarkdown}
        isSaving={isSaving}
        handleContextMenu={handleContextMenu}
      />
      
      {/* Context menu */}
      <ContextMenu
        contextMenu={contextMenu}
        isJinaSearching={isJinaSearching}
        jinaSearchResults={jinaSearchResults}
        showReferencesSubmenu={showReferencesSubmenu}
        setShowReferencesSubmenu={setShowReferencesSubmenu}
        referencesSubmenuPosition={referencesSubmenuPosition}
        selectedReferences={selectedReferences}
        handleSelectedTextAction={handleSelectedTextAction}
        handleReferencesHover={handleReferencesHover}
        handleReferencesLeave={handleReferencesLeave}
        addReferenceToText={addReferenceToText}
        aiActions={aiActions}
        selectedText={selectedText}
        doAiAction={handleAiAction}
        setShowAddActionForm={setShowAddActionForm}
      />
      
      {/* Processing overlay */}
      <ProcessingOverlay
        isProcessing={isProcessing}
        processingMessage={processingMessage}
      />
      
      {/* Modals */}
      <CreateFileModal
        showCreateModal={showCreateModal}
        newFileName={newFileName}
        setNewFileName={setNewFileName}
        setShowCreateModal={setShowCreateModal}
        createFile={createFile}
      />
      
      <AddActionModal
        showAddActionForm={showAddActionForm}
        newAction={newAction}
        setNewAction={setNewAction}
        setShowAddActionForm={setShowAddActionForm}
        addAiAction={addAiAction}
      />
    </div>
  );
};

export default Dashboard;