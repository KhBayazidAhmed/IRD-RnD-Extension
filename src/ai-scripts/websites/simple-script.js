/**
 * Simple Custom Script for Running JavaScript on Any Website
 * This is a cleaner, simpler version for running custom code
 */

// Main function that will be called by the extension
async function fillAndSubmitPrompt(jsCode) {
  try {
    // Add helpful utilities to the global scope
    window.utils = {
      // Select elements
      $: (selector) => document.querySelector(selector),
      $$: (selector) => Array.from(document.querySelectorAll(selector)),

      // Common actions
      hide: (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => (el.style.display = 'none'));
        return elements.length;
      },

      show: (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => (el.style.display = ''));
        return elements.length;
      },

      highlight: (selector, color = 'yellow') => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          el.style.backgroundColor = color;
          el.style.border = '2px solid red';
        });
        return elements.length;
      },

      remove: (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
        return elements.length;
      },

      text: (selector, newText) => {
        const elements = document.querySelectorAll(selector);
        if (newText === undefined) {
          return elements[0]?.textContent;
        }
        elements.forEach((el) => (el.textContent = newText));
        return elements.length;
      },

      click: (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => el.click());
        return elements.length;
      },

      css: (cssCode) => {
        const style = document.createElement('style');
        style.textContent = cssCode;
        document.head.appendChild(style);
        return true;
      },

      info: () => ({
        title: document.title,
        url: window.location.href,
        domain: window.location.hostname,
        elements: document.querySelectorAll('*').length,
        images: document.querySelectorAll('img').length,
        links: document.querySelectorAll('a').length,
      }),
    };

    // Execute the user's JavaScript code
    const func = new Function('utils', 'return (' + jsCode + ')');
    const result = func(window.utils);

    return { success: true, result: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Make the function available globally
if (typeof window !== 'undefined') {
  window.fillAndSubmitPrompt = fillAndSubmitPrompt;
}

// Example usage (for documentation):
/*
Examples of JavaScript you can run:

1. Get page info:
   utils.info()

2. Hide all images:
   utils.hide('img')

3. Highlight all links:
   utils.highlight('a', 'lightblue')

4. Change all h1 text:
   utils.text('h1', 'Modified by Extension!')

5. Add custom CSS:
   utils.css('body { background: linear-gradient(45deg, #ff6b6b, #4ecdc4) !important; }')

6. Complex operations:
   utils.$$('div').forEach((div, i) => {
     if (i % 2 === 0) div.style.backgroundColor = 'lightgray';
   });
   
7. Click all buttons:
   utils.click('button')

8. Get all paragraph text:
   utils.$$('p').map(p => p.textContent)
*/
