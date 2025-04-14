const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

/**
 * Process text using the AI service
 * @param {string} text - Text to process
 * @param {string} action - Action to perform (e.g., 'simplify', 'enhance')
 * @param {string} description - Description of the action
 * @param {string} contextBefore - Text before the selection for context
 * @param {string} contextAfter - Text after the selection for context
 * @returns {Promise<string>} - Processed text
 */
async function processText(text, action, description, contextBefore = '', contextAfter = '') {
  try {
    const prompt = `
I'll show you some text with context around it. Your task is to ${action} ONLY the text between the ### markers.
${description}
ONLY return the edited version of the text between the markers, nothing else.

Text before for context:
${contextBefore}

### TEXT TO ${action.toUpperCase()}: ###
${text}
### END TEXT TO ${action.toUpperCase()} ###

Text after for context:
${contextAfter}
`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful writer assistant that edits text in whichever ways the user requires. You return only the edited text and no other character" },
        { role: "user", content: prompt }
      ],
      model: "deepseek-chat",
    });

    // Extract and return the processed text
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in AI text processing:', error);
    throw new Error(`AI processing failed: ${error.message}`);
  }
}

module.exports = { processText };
