// Microsoft Copilot Script
window.fillAndSubmitPrompt = async function fillAndSubmitPrompt(prompt) {
  try {
    await new Promise((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve);
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const inputElement =
      document.querySelector('textarea') ||
      document.querySelector('[contenteditable="true"]') ||
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

    const submitButton =
      document.querySelector('[aria-label*="Send"]') ||
      document.querySelector('button[type="submit"]');

    if (!submitButton || submitButton.disabled) {
      return { success: false, error: 'Submit button not found' };
    }

    submitButton.click();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
