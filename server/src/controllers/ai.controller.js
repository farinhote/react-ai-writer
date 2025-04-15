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
        success: false,
        content: 'Text, action, and description are required'
      });
    }
    
    const result = await aiService.processText(
      text,
      action,
      description,
      contextBefore || '',
      contextAfter || ''
    );
    
    // If the AI processing was not successful, return a 422 error
    if (!result.success) {
      return res.status(422).json({
        success: false,
        content: result.content
      });
    }
    
    // Success - return the processed text
    res.status(200).json({ 
      success: true,
      processedText: result.content 
    });
  } catch (error) {
    console.error('Error processing text with AI:', error);
    res.status(500).json({ 
      success: false,
      content: `AI processing failed: ${error.message}` 
    });
  }
};

module.exports = {
  processText
};