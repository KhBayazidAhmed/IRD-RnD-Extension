import { useState } from 'react';

import {
  getEnabledWebsites,
  getWebsitesByCategory,
} from '../ai-scripts/config';

interface UsePopupStateReturn {
  selectedWebsites: string[];
  prompt: string;
  isSubmitting: boolean;
  error: string;
  handleWebsiteToggle: (websiteId: string) => void;
  setPrompt: (prompt: string) => void;
  setError: (error: string) => void;
  handleSubmit: () => Promise<void>;
  selectAllInCategory: (category: string) => void;
  clearSelection: () => void;
}

/**
 * Custom hook for managing popup state and logic
 */
export default function usePopupState(): UsePopupStateReturn {
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleWebsiteToggle = (websiteId: string) => {
    setSelectedWebsites((prev) =>
      prev.includes(websiteId)
        ? prev.filter((id) => id !== websiteId)
        : [...prev, websiteId]
    );
  };

  const selectAllInCategory = (category: string) => {
    const websitesInCategory = getWebsitesByCategory(category);
    const categoryIds = websitesInCategory.map((site) => site.id);

    setSelectedWebsites((prev) => {
      // If all in category are selected, deselect them
      const allSelected = categoryIds.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !categoryIds.includes(id));
      }

      // Otherwise, add all category items
      const newSelection = [...prev];
      categoryIds.forEach((id) => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      return newSelection;
    });
  };

  const clearSelection = () => {
    setSelectedWebsites([]);
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || selectedWebsites.length === 0) {
      setError('Please select at least one AI website and enter a prompt');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const enabledWebsites = getEnabledWebsites();
      const selectedSites = enabledWebsites.filter((site) =>
        selectedWebsites.includes(site.id)
      );

      // eslint-disable-next-line no-console
      console.log('[Popup] Submitting to websites:', selectedSites);
      // eslint-disable-next-line no-console
      console.log('[Popup] Prompt:', prompt.substring(0, 50));

      // Send message to background script to handle tab creation and prompt submission
      const response = await chrome.runtime.sendMessage({
        action: 'submitToAI',
        websites: selectedSites,
        prompt: prompt.trim(),
      });

      // eslint-disable-next-line no-console
      console.log('[Popup] Background response:', response);

      if (!response?.success) {
        throw new Error(response?.error || 'Failed to submit to AI websites');
      }

      // Show success message instead of closing immediately for debugging
      setError(
        'Success! Check the opened tabs. Popup will close in 3 seconds...'
      );
      setTimeout(() => {
        window.close();
      }, 3000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Popup] Error submitting:', err);
      setError(`Error submitting to AI websites: ${(err as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedWebsites,
    prompt,
    isSubmitting,
    error,
    handleWebsiteToggle,
    setPrompt,
    setError,
    handleSubmit,
    selectAllInCategory,
    clearSelection,
  };
}
