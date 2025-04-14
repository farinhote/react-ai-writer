/**
 * In-memory files storage
 * Replace with actual database in a production environment
 */
const files = [];

/**
 * Create a new file
 * @param {Object} fileData - File data
 * @returns {Object} - Created file
 */
const createFile = (userId, title, content = '') => {
  const newFile = {
    id: files.length + 1,
    userId,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  files.push(newFile);
  return newFile;
};

/**
 * Get all files for a user
 * @param {number} userId - User ID
 * @returns {Array} - Array of files
 */
const getFilesByUser = (userId) => {
  return files.filter(file => file.userId === userId);
};

/**
 * Get a file by ID
 * @param {number} fileId - File ID
 * @returns {Object} - File object
 */
const getFileById = (fileId) => {
  return files.find(file => file.id === fileId);
};

/**
 * Update a file
 * @param {number} fileId - File ID
 * @param {Object} updates - Updates to apply
 * @returns {Object} - Updated file
 */
const updateFile = (fileId, updates) => {
  const fileIndex = files.findIndex(file => file.id === fileId);
  
  if (fileIndex === -1) {
    return null;
  }
  
  const updatedFile = {
    ...files[fileIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  files[fileIndex] = updatedFile;
  return updatedFile;
};

/**
 * Delete a file
 * @param {number} fileId - File ID
 * @returns {boolean} - Success indicator
 */
const deleteFile = (fileId) => {
  const fileIndex = files.findIndex(file => file.id === fileId);
  
  if (fileIndex === -1) {
    return false;
  }
  
  files.splice(fileIndex, 1);
  return true;
};

module.exports = {
  createFile,
  getFilesByUser,
  getFileById,
  updateFile,
  deleteFile,
};
