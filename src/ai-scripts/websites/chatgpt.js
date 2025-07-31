// ChatGPT Script
// This script handles ChatGPT interactions

// Add debugging utilities
const DEBUG_PREFIX = '[ChatGPT Script]';
const debugLog = (message, data = null) => {
  console.log(`${DEBUG_PREFIX} ${message}`, data || '');
  // Also show visual notification
  showDebugNotification(message);
};

const showDebugNotification = (message) => {
  // Create a visual indicator
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 12px;
    max-width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `;
  notification.textContent = `${DEBUG_PREFIX} ${message}`;
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
};

// Initialize script and log that it's loaded
debugLog('Script loaded and initialized!');

window.fillAndSubmitPrompt = async function (prompt) {
  debugLog('Function called with prompt:', prompt);

  try {
    debugLog('Starting execution...');

    // Wait for page to load
    debugLog('Waiting for page to load...');
    await new Promise((resolve) => {
      if (document.readyState === 'complete') {
        debugLog('Page already loaded');
        resolve();
      } else {
        debugLog('Waiting for load event...');
        window.addEventListener('load', resolve);
      }
    });

    // Wait a bit more for React to render
    debugLog('Waiting for React to render...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    document.body.style.display = 'none'; // Prevent scrolling during input
    debugLog('Hidden body to prevent scrolling');

    // Find input element with multiple selectors
    debugLog('Searching for input element...');
    const inputSelectors = [
      '#prompt-textarea',
      'textarea[placeholder*="Message"]',
      '[data-id="prompt-textarea"]',
      '[contenteditable="true"][data-testid*="composer"]',
    ];

    let inputElement = null;
    for (let i = 0; i < inputSelectors.length; i += 1) {
      const selector = inputSelectors[i];
      debugLog(`Trying selector: ${selector}`);
      inputElement = document.querySelector(selector);
      if (inputElement && inputElement.offsetHeight > 0) {
        debugLog(`Found input element with selector: ${selector}`);
        break;
      }
    }

    if (!inputElement) {
      debugLog('ERROR: Input element not found');
      document.body.style.display = ''; // Show body again
      return { success: false, error: 'Input element not found' };
    }

    // Focus and fill input
    debugLog('Focusing on input element...');
    inputElement.focus();
    await new Promise((resolve) => setTimeout(resolve, 100));

    debugLog('Filling input with prompt...');
    if (inputElement.tagName === 'TEXTAREA') {
      inputElement.value = prompt;
      debugLog('Set value for textarea');
    } else {
      inputElement.textContent = prompt;
      debugLog('Set textContent for contenteditable');
    }

    // Trigger input events
    debugLog('Triggering input events...');
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find submit button with more thorough search
    debugLog('Searching for submit button...');
    let submitButton = null;

    // Try the most common selectors first
    const primarySelectors = [
      '[data-testid="send-button"]',
      'button[aria-label*="Send"]',
      'button[aria-label*="send"]',
    ];

    // Try primary selectors
    let i = 0;
    while (i < primarySelectors.length && !submitButton) {
      const selector = primarySelectors[i];
      debugLog(`Trying primary selector: ${selector}`);
      submitButton = document.querySelector(selector);
      if (
        submitButton &&
        !submitButton.disabled &&
        submitButton.offsetHeight > 0
      ) {
        debugLog(`Found submit button with primary selector: ${selector}`);
        break;
      }
      submitButton = null;
      i += 1;
    }

    // If not found, try secondary selectors
    if (!submitButton) {
      const secondarySelectors = [
        'button[type="submit"]',
        '[data-testid="fruitjuice-send-button"]',
        'button[class*="send"]',
        'button[class*="submit"]',
      ];

      i = 0;
      while (i < secondarySelectors.length && !submitButton) {
        const selector = secondarySelectors[i];
        debugLog(`Trying secondary selector: ${selector}`);
        submitButton = document.querySelector(selector);
        if (
          submitButton &&
          !submitButton.disabled &&
          submitButton.offsetHeight > 0
        ) {
          debugLog(`Found submit button with secondary selector: ${selector}`);
          break;
        }
        submitButton = null;
        i += 1;
      }
    }

    // If still not found, look for buttons with SVG icons
    if (!submitButton) {
      debugLog('Looking for buttons with SVG icons...');
      const buttons = document.querySelectorAll('button:not([disabled])');
      i = 0;
      while (i < buttons.length && !submitButton) {
        const btn = buttons[i];
        if (btn.querySelector('svg') && btn.offsetHeight > 0) {
          const svg = btn.querySelector('svg');
          // Check if it looks like a send icon (arrow or similar)
          if (
            svg &&
            (svg.innerHTML.includes('path') ||
              svg.innerHTML.includes('polygon'))
          ) {
            debugLog(`Found potential submit button with SVG at index ${i}`);
            submitButton = btn;
            break;
          }
        }
        i += 1;
      }
    }

    // Last resort: look for any button near the input
    if (!submitButton && inputElement) {
      debugLog('Looking for buttons near the input...');
      const parentForm =
        inputElement.closest('form') || inputElement.closest('div');
      if (parentForm) {
        const nearbyButtons = parentForm.querySelectorAll(
          'button:not([disabled])'
        );
        if (nearbyButtons.length > 0) {
          // Take the last button (usually the submit button)
          submitButton = nearbyButtons[nearbyButtons.length - 1];
          debugLog('Using last button near input as submit button');
        }
      }
    }

    if (!submitButton) {
      debugLog('ERROR: Submit button not found');
      document.body.style.display = ''; // Show body again
      return { success: false, error: 'Submit button not found' };
    }

    // Click submit
    debugLog('Clicking submit button...');
    submitButton.click();

    // Restore body visibility
    document.body.style.display = '';
    debugLog('SUCCESS: Prompt submitted successfully!');

    return { success: true };
  } catch (error) {
    debugLog('ERROR occurred:', error.message);
    document.body.style.display = ''; // Show body again in case of error
    return { success: false, error: error.message };
  }
};

// Test function to verify script is working
window.testChatGPTScript = function () {
  debugLog('Test function called - Script is working!');

  // Show current page info
  debugLog(`Current URL: ${window.location.href}`);
  debugLog(`Page title: ${document.title}`);
  debugLog(`Ready state: ${document.readyState}`);

  // Test element detection
  const inputSelectors = [
    '#prompt-textarea',
    'textarea[placeholder*="Message"]',
    '[data-id="prompt-textarea"]',
    '[contenteditable="true"][data-testid*="composer"]',
  ];

  let foundElements = 0;
  inputSelectors.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      foundElements += 1;
      debugLog(`Found element with selector: ${selector}`);
    }
  });

  if (foundElements === 0) {
    debugLog('WARNING: No input elements found on this page');
  }

  const submitSelectors = [
    '[data-testid="send-button"]',
    'button[aria-label*="Send"]',
    '[data-testid="fruitjuice-send-button"]',
    'button[type="submit"]',
  ];

  let foundSubmitButtons = 0;
  submitSelectors.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      foundSubmitButtons += 1;
      debugLog(`Found submit button with selector: ${selector}`);
    }
  });

  if (foundSubmitButtons === 0) {
    debugLog('WARNING: No submit buttons found on this page');
  }

  return {
    success: true,
    inputElements: foundElements,
    submitButtons: foundSubmitButtons,
    url: window.location.href,
  };
};

// Auto-run test when script loads
debugLog('Running auto-test...');
setTimeout(() => {
  window.testChatGPTScript();
}, 1000);
