import { useState } from 'react';
import axios from 'axios';
import { JinaSearchResult } from '../types';

export const useJinaSearch = () => {
  const [jinaSearchResults, setJinaSearchResults] = useState<JinaSearchResult[]>([]);
  const [isJinaSearching, setIsJinaSearching] = useState(false);
  const [showReferencesSubmenu, setShowReferencesSubmenu] = useState(false);
  const [referencesSubmenuPosition, setReferencesSubmenuPosition] = useState({ x: 0, y: 0 });
  const [selectedReferences, setSelectedReferences] = useState<string[]>([]);

  // Jina AI search function
  const searchWithJina = async (searchText: string) => {
    try {
      setIsJinaSearching(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${API_URL}/jina/search`, {
        query: searchText
      });

      // Make sure we're setting an array
      if (Array.isArray(response.data.results)) {
        setJinaSearchResults(response.data.results);
      } else {
        console.error('Unexpected results format:', response.data.results);
        setJinaSearchResults([]);
      }
      setIsJinaSearching(false);
    } catch (error) {
      console.error('Error searching with Jina AI:', error);
      setIsJinaSearching(false);
      setJinaSearchResults([]);
    }
  };

  // Show references submenu on hover
  const handleReferencesHover = (e: React.MouseEvent) => {
    const targetElement = e.currentTarget as HTMLElement;
    const rect = targetElement.getBoundingClientRect();

    setReferencesSubmenuPosition({
      x: rect.right,
      y: rect.top
    });

    setShowReferencesSubmenu(true);
  };

  // Hide references submenu
  const handleReferencesLeave = () => {
    // Add a small delay to prevent quick flash
    setTimeout(() => {
      if (!document.querySelector('.references-submenu:hover')) {
        setShowReferencesSubmenu(false);
      }
    }, 100);
  };

  return {
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
  };
};

export default useJinaSearch;