import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { File } from '../types';

export const useFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState<string>('# New Document\n\nStart typing...');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');

  // Load user files
  const fetchUserFiles = useCallback(async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${API_URL}/files`);
      setFiles(response.data);

      // Set active file to first file if none selected
      if (response.data.length > 0 && !activeFile) {
        setActiveFile(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }, [activeFile]);

  // Create a new file
  const createFile = async () => {
    if (!newFileName.trim()) {
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${API_URL}/files`, {
        title: newFileName,
        content: '# ' + newFileName + '\n\nStart typing...'
      });

      setFiles([...files, response.data]);
      setActiveFile(response.data);
      setMarkdown(response.data.content);
      setShowCreateModal(false);
      setNewFileName('');
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  // Save the current file
  const saveFile = async () => {
    if (!activeFile) return;

    setIsSaving(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await axios.put(`${API_URL}/files/${activeFile.id}`, {
        content: markdown
      });

      // Update the files state
      const updatedFiles = files.map(file =>
        file.id === activeFile.id ? { ...file, content: markdown, updatedAt: response.data.updatedAt } : file
      );

      setFiles(updatedFiles);
      setActiveFile({ ...activeFile, content: markdown, updatedAt: response.data.updatedAt });
    } catch (error) {
      console.error('Error saving file:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a file
  const deleteFile = async (fileId: number) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      await axios.delete(`${API_URL}/files/${fileId}`);

      // Update the files state
      const updatedFiles = files.filter(file => file.id !== fileId);
      setFiles(updatedFiles);

      // If active file was deleted, set new active file
      if (activeFile && activeFile.id === fileId) {
        if (updatedFiles.length > 0) {
          setActiveFile(updatedFiles[0]);
        } else {
          setActiveFile(null);
        }
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  // Watch for changes in activeFile
  useEffect(() => {
    if (activeFile) {
      setMarkdown(activeFile.content);
    } else {
      setMarkdown('# New Document\n\nStart typing...');
    }
  }, [activeFile]);

  // Auto-save changes
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (activeFile && markdown !== activeFile.content) {
        saveFile();
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [markdown, activeFile]);

  // Initial load
  useEffect(() => {
    fetchUserFiles();
  }, [fetchUserFiles]);

  return {
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
    fetchUserFiles,
    createFile,
    saveFile,
    deleteFile
  };
};

export default useFiles;