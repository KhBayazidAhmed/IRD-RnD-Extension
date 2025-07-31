// Gemini Script
window.fillAndSubmitPrompt = async function fillAndSubmitPrompt(prompt) {
  try {
    await new Promise((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve);
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Find input
    const inputElement =
      document.querySelector('[contenteditable="true"]') ||
      document.querySelector('textarea') ||
      document.querySelector('input[type="text"]');

    if (!inputElement) {
      return { success: false, error: 'Input not found' };
    }

    inputElement.focus();
    if (inputElement.hasAttribute('contenteditable')) {
      inputElement.textContent = prompt;
    } else {
      inputElement.value = prompt;
    }

    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find submit
    const submitButton =
      document.querySelector('[aria-label="Send message"]') ||
      document.querySelector('button[type="submit"]') ||
      document.querySelector('[data-testid*="send"]');

    if (!submitButton || submitButton.disabled) {
      return { success: false, error: 'Submit button not found' };
    }

    submitButton.click();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
