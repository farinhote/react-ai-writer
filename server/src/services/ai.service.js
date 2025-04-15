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
 * @returns {Promise<Object>} - Object with success flag and content
 */
async function processText(text, action, description, contextBefore = '', contextAfter = '') {
  try {
    const prompt = `
I'll show you some text with context around it. Your task is to ${action} ONLY the text between the ### markers.
${description}

IMPORTANT: You MUST format your response as a valid JSON object with the following structure:
{
  "success": boolean,
  "content": string
}

If you are able to successfully ${action} the text, set "success" to true and put the processed text in "content".
If you cannot process the text due to policy violations, inappropriate content, or any other reason, set "success" to false and include a brief explanation in "content".

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
        { role: "system", content: "You are a helpful writer assistant that edits text and always responds in JSON format with {success, content} structure. For policy violations or inappropriate content, you return {\"success\": false, \"content\": \"explanation\"}." },
        { role: "user", content: prompt }
      ],
      model: "deepseek-chat",
      response_format: { type: "json_object" }
    });

    // Extract the response and parse as JSON
    const responseText = completion.choices[0].message.content.trim();

    // Try to parse the JSON response
    try {
      const jsonResponse = JSON.parse(responseText);
      // Validate the structure
      if (typeof jsonResponse.success !== 'boolean' || typeof jsonResponse.content !== 'string') {
        throw new Error('Invalid response structure');
      }

      return jsonResponse;
    } catch (parseError) {
      // If JSON parsing fails, construct a valid response ourselves
      console.error('Failed to parse LLM response as JSON:', parseError);
      return {
        success: true,
        content: responseText // Return the raw text as content with success flag
      };
    }
  } catch (error) {
    console.error('Error in AI text processing:', error);
    return {
      success: false,
      content: `AI processing failed: ${error.message}`
    };
  }
}

module.exports = { processText };