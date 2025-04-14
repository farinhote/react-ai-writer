const axios = require('axios');
require('dotenv').config();

/**
 * Search the web using Jina AI search service
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Formatted search results
 */
async function searchWeb(query) {
  try {
    const response = await axios.get(`https://s.jina.ai/?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
        'X-Respond-With': 'no-content'
      }
    });

    const results = response.data

    return results;
  } catch (error) {
    console.error('Error in Jina AI search:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(`Jina AI search failed: ${error.message}`);
  }
}

/**
 * Read content from a URL using Jina AI reader service
 * @param {string} url - URL to read content from
 * @returns {Promise<Object>} - Content of the URL
 */
async function readUrl(url) {
  try {
    const response = await axios.get(`https://r.jina.ai/?url=${encodeURIComponent(url)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.JINA_API_KEY}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error in Jina AI read URL:', error);
    throw new Error(`Jina AI read URL failed: ${error.message}`);
  }
}

module.exports = { searchWeb, readUrl };