/**
 * Background script for the Chrome extension.
 * Handles communication between the popup/content scripts and the AI ScriptManager.
 *
 * Main responsibilities:
 * - Process 'submitToAI' messages from the popup
 * - Coordinate AI website automation through ScriptManager
 * - Handle extension installation events
 */

import ScriptManager from '../ai-scripts/ScriptManager';
import { SubmitMessage } from '../types';

// Response type for message handling
interface MessageResponse {
  success: boolean;
  error?: string;
}

chrome.runtime.onMessage.addListener(
  (message: SubmitMessage, _sender, sendResponse) => {
    // eslint-disable-next-line no-console
    console.log('[Background] Received message:', message);

    if (message.action === 'submitToAI') {
      // eslint-disable-next-line no-console
      console.log('[Background] Processing submitToAI with:', {
        websites: message.websites,
        prompt: `${message.prompt.substring(0, 50)}...`,
      });

      ScriptManager.submitToWebsites(message.websites, message.prompt)
        .then(() => {
          // eslint-disable-next-line no-console
          console.log('[Background] Successfully submitted to websites');
          const response: MessageResponse = { success: true };
          sendResponse(response);
        })
        .catch((error: Error) => {
          // eslint-disable-next-line no-console
          console.error('[Background] Error submitting to websites:', error);
          const response: MessageResponse = {
            success: false,
            error: error.message || 'Unknown error occurred',
          };
          sendResponse(response);
        });
      return true; // Keep message channel open for async response
    }

    return false; // Default return for unhandled messages
  }
);

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  // eslint-disable-next-line no-console
  console.log('[Background] Extension installed:', details.reason);
});
