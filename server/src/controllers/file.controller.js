const FileModel = require('../models/file.model');

/**
 * Create a new file
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createFile = (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const newFile = FileModel.createFile(userId, title, content || '');
    
    res.status(201).json(newFile);
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ message: 'Server error while creating file' });
  }
};

/**
 * Get all files for authenticated user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUserFiles = (req, res) => {
  try {
    const userId = req.user.id;
    const files = FileModel.getFilesByUser(userId);
    
    res.status(200).json(files);
  } catch (error) {
    console.error('Error getting files:', error);
    res.status(500).json({ message: 'Server error while fetching files' });
  }
};

/**
 * Get a file by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getFile = (req, res) => {
  try {
    const fileId = parseInt(req.params.fileId);
    const file = FileModel.getFileById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if file belongs to user
    if (file.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to access this file' });
    }
    
    res.status(200).json(file);
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({ message: 'Server error while fetching file' });
  }
};

/**
 * Update a file
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateFile = (req, res) => {
  try {
    const fileId = parseInt(req.params.fileId);
    const { title, content } = req.body;
    
    const file = FileModel.getFileById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if file belongs to user
    if (file.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this file' });
    }
    
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    
    const updatedFile = FileModel.updateFile(fileId, updates);
    
    res.status(200).json(updatedFile);
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({ message: 'Server error while updating file' });
  }
};

/**
 * Delete a file
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deleteFile = (req, res) => {
  try {
    const fileId = parseInt(req.params.fileId);
    
    const file = FileModel.getFileById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if file belongs to user
    if (file.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this file' });
    }
    
    const success = FileModel.deleteFile(fileId);
    
    if (success) {
      res.status(200).json({ message: 'File deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete file' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Server error while deleting file' });
  }
};

module.exports = {
  createFile,
  getUserFiles,
  getFile,
  updateFile,
  deleteFile
};