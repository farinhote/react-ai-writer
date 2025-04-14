const jinaService = require('../services/jina.service');

/**
 * Search the web using Jina AI
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const searchWeb = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        message: 'Query is required'
      });
    }

    const searchResults = await jinaService.searchWeb(query);
    console.log(searchResults)
    // Parse the search results string into a structured array
    const parsedResults = [];

    // Split by double newlines to get each result block
    const resultBlocks = searchResults.split('\n\n');

    for (const block of resultBlocks) {
      if (!block.trim()) continue;

      const lines = block.split('\n');
      const resultObj = {};

      for (const line of lines) {
        if (line.includes('Title:')) {
          const match = line.match(/\[\d+\] Title: (.*)/);
          if (match) resultObj.title = match[1];
        } else if (line.includes('URL Source:')) {
          const match = line.match(/\[\d+\] URL Source: (.*)/);
          if (match) resultObj.url = match[1];
        } else if (line.includes('Description:')) {
          const match = line.match(/\[\d+\] Description: (.*)/);
          if (match) resultObj.description = match[1];
        } else if (line.includes('Date:')) {
          const match = line.match(/\[\d+\] Date: (.*)/);
          if (match) resultObj.date = match[1];
        }
      }

      if (resultObj.title && resultObj.url) {
        parsedResults.push(resultObj);
      }
    }

    res.status(200).json({
      results: parsedResults
    });
  } catch (error) {
    console.error('Error searching with Jina AI:', error);
    res.status(500).json({
      message: `Jina AI search failed: ${error.message}`
    });
  }
};

/**
 * Read URL content using Jina AI
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const readUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        message: 'URL is required'
      });
    }

    const content = await jinaService.readUrl(url);

    res.status(200).json({
      content
    });
  } catch (error) {
    console.error('Error reading URL with Jina AI:', error);
    res.status(500).json({
      message: `Jina AI read URL failed: ${error.message}`
    });
  }
};

module.exports = {
  searchWeb,
  readUrl
};