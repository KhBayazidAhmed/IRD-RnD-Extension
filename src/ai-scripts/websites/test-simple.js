// Simple test script for debugging
console.log('[Test Script] Loading...');

window.fillAndSubmitPrompt = async function (prompt) {
  console.log('[Test Script] Function called with prompt:', prompt);

  try {
    // Create a visual indicator that the script is working
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #4CAF50;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      max-width: 300px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    notification.textContent = `Test Script Working! Prompt: ${prompt.substring(0, 50)}...`;
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);

    console.log('[Test Script] SUCCESS: Visual notification shown');
    return { success: true };
  } catch (error) {
    console.error('[Test Script] ERROR:', error);
    return { success: false, error: error.message };
  }
};

console.log(
  '[Test Script] Loaded successfully, fillAndSubmitPrompt function defined'
);
