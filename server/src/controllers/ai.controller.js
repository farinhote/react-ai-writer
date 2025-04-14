const aiService = require('../services/ai.service');

/**
 * Process text using AI
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const processText = async (req, res) => {
  try {
    const { text, action, description, contextBefore, contextAfter } = req.body;
    
    if (!text || !action || !description) {
      return res.status(400).json({ 
        message: 'Text, action, and description are required' 
      });
    }
    
    const processedText = await aiService.processText(
      text,
      action,
      description,
      contextBefore || '',
      contextAfter || ''
    );
    
    res.status(200).json({ 
      processedText 
    });
  } catch (error) {
    console.error('Error processing text with AI:', error);
    res.status(500).json({ 
      message: `AI processing failed: ${error.message}` 
    });
  }
};

module.exports = {
  processText
};