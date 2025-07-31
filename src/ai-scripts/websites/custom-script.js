/**
 * Custom JavaScript Script Runner
 * This script allows you to run any JavaScript code on any website
 */

// This function will be called with your custom JavaScript code
async function fillAndSubmitPrompt(javascriptCode) {
  try {
    // Execute the provided JavaScript code
    const result = eval(javascriptCode);

    // If the result is a promise, await it
    if (result instanceof Promise) {
      await result;
    }

    console.log('Custom script executed successfully:', result);
    return { success: true, result: result };
  } catch (error) {
    console.error('Error executing custom script:', error);
    return { success: false, error: error.message };
  }
}

// Alternative: Execute code in a safer way using Function constructor
async function executeCustomScript(code) {
  try {
    const func = new Function('return (' + code + ')');
    const result = func();

    if (result instanceof Promise) {
      return await result;
    }

    return result;
  } catch (error) {
    throw new Error(`Script execution failed: ${error.message}`);
  }
}

// Helper functions for common tasks
function highlightElements(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    el.style.border = '3px solid red';
    el.style.backgroundColor = 'yellow';
  });
  return elements.length;
}

function removeElementsBySelector(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => el.remove());
  return elements.length;
}

function changeTextContent(selector, newText) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => (el.textContent = newText));
  return elements.length;
}

function addCustomCSS(css) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  return true;
}

// Export the main function
if (typeof window !== 'undefined') {
  window.fillAndSubmitPrompt = fillAndSubmitPrompt;
  window.executeCustomScript = executeCustomScript;
  window.highlightElements = highlightElements;
  window.removeElementsBySelector = removeElementsBySelector;
  window.changeTextContent = changeTextContent;
  window.addCustomCSS = addCustomCSS;
}
