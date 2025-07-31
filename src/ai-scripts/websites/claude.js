// Claude Script
// This script handles Claude.ai interactions

window.fillAndSubmitPrompt = async function fillAndSubmitPrompt(prompt) {
  try {
    // Wait for page to load
    await new Promise((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve);
    });

    // Wait for Claude interface to load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Find input element
    const inputSelectors = [
      '[contenteditable="true"]',
      'div[data-value]',
      '[role="textbox"]',
      'textarea',
    ];

    let inputElement = null;
    inputSelectors.forEach((selector) => {
      if (!inputElement) {
        const el = document.querySelector(selector);
        if (el && el.offsetHeight > 0) inputElement = el;
      }
    });

    if (!inputElement) {
      return { success: false, error: 'Input element not found' };
    }

    // Focus and fill input
    inputElement.focus();
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (inputElement.hasAttribute('contenteditable')) {
      inputElement.textContent = prompt;
    } else {
      inputElement.value = prompt;
    }

    // Trigger events
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find submit button
    const submitSelectors = [
      '[aria-label*="Send"]',
      'button[aria-label*="Send Message"]',
      '[data-testid*="send"]',
      'button[type="submit"]',
    ];

    let submitButton = null;
    submitSelectors.forEach((selector) => {
      if (!submitButton) {
        const el = document.querySelector(selector);
        if (el && !el.disabled && el.offsetHeight > 0) submitButton = el;
      }
    });

    if (!submitButton) {
      return { success: false, error: 'Submit button not found' };
    }

    // Click submit
    submitButton.click();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
