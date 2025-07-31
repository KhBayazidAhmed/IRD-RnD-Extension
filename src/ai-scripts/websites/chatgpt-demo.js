/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

// ChatGPT Enhanced Demo Script - Removes home page and adds custom prompt interface
(function chatGPTDemo() {
  'use strict';

  const DEBUG_PREFIX = '[ChatGPT Enhanced Demo]';

  // Debug utilities
  function debugLog(message, data) {
    console.log(`${DEBUG_PREFIX} ${message}`, data || '');
    showDebugNotification(message);
  }

  function showDebugNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #10a37f;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      max-width: 350px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      border: 1px solid rgba(255,255,255,0.1);
    `;
    notification.textContent = `${DEBUG_PREFIX} ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
  }

  // Function to restore original page
  function restoreOriginalPage() {
    debugLog('Restoring original page elements...');

    // Remove custom interface
    const customInterface = document.getElementById('custom-prompt-interface');
    if (customInterface) {
      customInterface.remove();
    }

    // Show all hidden elements
    const hiddenElements = document.querySelectorAll(
      '[style*="display: none"]'
    );
    hiddenElements.forEach((element) => {
      element.style.display = '';
    });

    // Refresh the page if needed
    if (hiddenElements.length > 0) {
      debugLog('Refreshing page to fully restore original state...');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  // Original implementation
  async function originalFillAndSubmitPrompt(prompt) {
    debugLog('Starting enhanced prompt submission...');

    // Wait for page to load
    await new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Find input element
    const inputSelectors = [
      '#prompt-textarea',
      'textarea[placeholder*="Message"]',
      '[data-id="prompt-textarea"]',
      '[contenteditable="true"][data-testid*="composer"]',
      'textarea[data-testid="composer-text-input"]',
    ];

    let inputElement = null;
    inputSelectors.forEach((selector) => {
      if (!inputElement) {
        debugLog(`Trying selector: ${selector}`);
        const element = document.querySelector(selector);
        if (element && element.offsetHeight > 0) {
          inputElement = element;
          debugLog(`Found input element with selector: ${selector}`);
        }
      }
    });

    if (!inputElement) {
      debugLog('ERROR: Input element not found');
      return { success: false, error: 'Input element not found' };
    }

    // Focus and fill input
    inputElement.focus();
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Set the value
    if (inputElement.tagName === 'TEXTAREA') {
      inputElement.value = prompt;
    } else {
      inputElement.textContent = prompt;
    }

    // Trigger events
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find submit button
    const submitSelectors = [
      '[data-testid="send-button"]',
      'button[aria-label*="Send"]',
      '[data-testid="fruitjuice-send-button"]',
      'button[type="submit"]',
      'button[data-testid="composer-send-button"]',
    ];

    let submitButton = null;
    submitSelectors.forEach((selector) => {
      if (!submitButton) {
        const button = document.querySelector(selector);
        if (button && !button.disabled && button.offsetHeight > 0) {
          submitButton = button;
          debugLog(`Found submit button with selector: ${selector}`);
        }
      }
    });

    if (!submitButton) {
      debugLog('ERROR: Submit button not found or disabled');
      return { success: false, error: 'Submit button not found' };
    }

    // Click submit
    submitButton.click();
    debugLog('SUCCESS: Prompt submitted successfully!');

    return { success: true };
  }

  // Function to remove ChatGPT home page content
  function removeHomePage() {
    debugLog('Removing ChatGPT home page content...');

    // Common selectors for ChatGPT home page elements
    const homePageSelectors = [
      '[data-testid="welcome-container"]',
      '.text-center.text-4xl.font-semibold',
      '.grid.gap-3.text-sm',
      '.text-xs.text-center',
      'main > div > div > div:first-child',
      '.flex.flex-col.items-center',
      '.max-w-3xl',
      'div[class*="welcome"]',
      'div[class*="examples"]',
      'div[class*="capabilities"]',
      'div[class*="limitations"]',
    ];

    let removedElements = 0;
    homePageSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        const text = element.textContent?.toLowerCase() || '';
        if (
          text.includes('chatgpt') ||
          text.includes('examples') ||
          text.includes('capabilities') ||
          text.includes('limitations') ||
          text.includes('welcome') ||
          element.querySelector('h1, h2, .text-4xl')
        ) {
          element.style.display = 'none';
          removedElements++;
          debugLog(`Removed element: ${selector}`);
        }
      });
    });

    // Also try to remove by content
    const allDivs = document.querySelectorAll('div, section, main');
    allDivs.forEach((div) => {
      const text = div.textContent?.toLowerCase() || '';
      if (
        (text.includes('chatgpt can make mistakes') ||
          text.includes('examples') ||
          text.includes('capabilities') ||
          text.includes('limitations')) &&
        div.children.length > 0
      ) {
        div.style.display = 'none';
        removedElements++;
        debugLog('Removed element by content match');
      }
    });

    debugLog(`Removed ${removedElements} home page elements`);
    return removedElements > 0;
  }

  // Function to create custom prompt interface
  function createCustomPromptInterface() {
    debugLog('Creating custom prompt interface...');

    // Remove existing interface if any
    const existingInterface = document.getElementById(
      'custom-prompt-interface'
    );
    if (existingInterface) {
      existingInterface.remove();
    }

    // Create the main container
    const container = document.createElement('div');
    container.id = 'custom-prompt-interface';
    container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 600px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: white;
      text-align: center;
    `;

    // Create the interface HTML
    container.innerHTML = `
      <div style="margin-bottom: 30px;">
        <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 700; background: linear-gradient(45deg, #fff, #f0f8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          🤖 AI Chat Enhanced
        </h1>
        <p style="margin: 0; font-size: 16px; opacity: 0.9; line-height: 1.5;">
          Custom interface for enhanced ChatGPT interaction
        </p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <textarea
          id="custom-prompt-input"
          placeholder="Enter your prompt here..."
          style="
            width: 100%;
            min-height: 120px;
            padding: 20px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-family: inherit;
            background: rgba(255,255,255,0.1);
            color: white;
            backdrop-filter: blur(10px);
            resize: vertical;
            outline: none;
            transition: all 0.3s ease;
          "
        ></textarea>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <button
          id="submit-custom-prompt"
          style="
            background: linear-gradient(45deg, #10a37f, #0d8a6b);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(16,163,127,0.3);
          "
        >
          🚀 Submit Prompt
        </button>
        
        <button
          id="restore-original"
          style="
            background: linear-gradient(45deg, #6b7280, #4b5563);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(107,114,128,0.3);
          "
        >
          🔄 Restore Original
        </button>
      </div>
      
      <div style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
        <p style="margin: 0;">This demo removes the ChatGPT home page and provides a custom interface</p>
      </div>
    `;

    // Add to page
    document.body.appendChild(container);

    // Add event listeners
    const submitButton = document.getElementById('submit-custom-prompt');
    const restoreButton = document.getElementById('restore-original');
    const promptInput = document.getElementById('custom-prompt-input');

    if (submitButton && promptInput) {
      submitButton.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (prompt) {
          debugLog('Submitting custom prompt:', prompt);

          // Hide the custom interface
          container.style.display = 'none';

          // Restore original page elements first
          restoreOriginalPage();

          // Wait a bit for page to restore
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Submit the prompt using the original function
          await window.fillAndSubmitPrompt(prompt);
        } else {
          debugLog('ERROR: Please enter a prompt');
        }
      });
    }

    if (restoreButton) {
      restoreButton.addEventListener('click', () => {
        debugLog('Restoring original page');
        container.remove();
        restoreOriginalPage();
      });
    }

    debugLog('Custom prompt interface created successfully!');
  }

  // Enhanced fill and submit function with demo features
  window.fillAndSubmitPrompt = async function fillAndSubmitPrompt(prompt) {
    debugLog('Enhanced fillAndSubmitPrompt called with prompt:', prompt);

    try {
      const result = await originalFillAndSubmitPrompt(prompt);
      debugLog('Original function result:', result);
      return result;
    } catch (error) {
      debugLog('ERROR in enhanced function:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Demo mode functions
  window.enableDemoMode = function enableDemoMode() {
    debugLog('Enabling demo mode...');

    // Wait for page to load
    setTimeout(() => {
      const removed = removeHomePage();
      if (removed) {
        createCustomPromptInterface();
        debugLog('Demo mode enabled successfully!');
      } else {
        debugLog('No home page elements found to remove');
        createCustomPromptInterface();
      }
    }, 2000);
  };

  window.disableDemoMode = function disableDemoMode() {
    debugLog('Disabling demo mode...');
    restoreOriginalPage();
  };

  // Test function
  window.testChatGPTEnhancedDemo = function testChatGPTEnhancedDemo() {
    debugLog('Testing enhanced demo script...');

    debugLog(`Current URL: ${window.location.href}`);
    debugLog(`Page title: ${document.title}`);

    // Test if we're on ChatGPT
    const isChatGPT =
      window.location.href.includes('chat.openai.com') ||
      window.location.href.includes('chatgpt.com');

    if (isChatGPT) {
      debugLog('Detected ChatGPT website');

      // Auto-enable demo mode if on home page
      const isHomePage =
        document.querySelector('[data-testid="welcome-container"]') ||
        document.querySelector('.text-4xl') ||
        document.body.textContent.includes('ChatGPT can make mistakes');

      if (isHomePage) {
        debugLog('Detected home page, auto-enabling demo mode...');
        window.enableDemoMode();
      }
    } else {
      debugLog('Not on ChatGPT website');
    }

    return {
      success: true,
      isChatGPT: isChatGPT,
      url: window.location.href,
    };
  };

  // Auto-initialize
  debugLog('Enhanced demo script loaded!');
  setTimeout(() => {
    window.testChatGPTEnhancedDemo();
  }, 1000);

  // Expose functions globally for external access
  window.chatGPTDemo = {
    enableDemo: window.enableDemoMode,
    disableDemo: window.disableDemoMode,
    test: window.testChatGPTEnhancedDemo,
    submit: window.fillAndSubmitPrompt,
  };

  debugLog('Enhanced ChatGPT demo script fully loaded! 🚀');
})();
