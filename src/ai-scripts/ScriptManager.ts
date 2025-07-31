import { AIWebsiteConfig } from './config';

declare global {
  interface Window {
    fillAndSubmitPrompt?: (
      prompt: string
    ) => Promise<{ success: boolean; error?: string }>;
  }
}

/**
 * Script Manager Service
 * Handles loading and executing JavaScript files on AI websites
 */
export default class ScriptManager {
  private static readonly SCRIPT_LOAD_DELAY = 3000;

  private static readonly TAB_LOAD_TIMEOUT = 30000;

  /**
   * Submit prompt to multiple AI websites
   */
  static async submitToWebsites(
    websites: AIWebsiteConfig[],
    prompt: string
  ): Promise<void> {
    const validWebsites = websites.filter((website) => website?.isEnabled);

    await Promise.all(
      validWebsites.map(async (website) => {
        try {
          await this.submitToSingleWebsite(website, prompt);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error submitting to ${website.name}:`, error);
        }
      })
    );
  }

  /**
   * Submit to a single AI website by loading its script
   */
  private static async submitToSingleWebsite(
    website: AIWebsiteConfig,
    prompt: string
  ): Promise<void> {
    const tab = await chrome.tabs.create({
      url: website.url,
      active: false,
    });

    if (!tab.id) {
      throw new Error(`Failed to create tab for ${website.name}`);
    }

    return new Promise((resolve, reject) => {
      let timeout: ReturnType<typeof setTimeout>;

      const tabUpdateListener = (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo
      ) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(tabUpdateListener);
          clearTimeout(timeout);

          setTimeout(() => {
            this.injectAndRunScript(tab.id!, website, prompt)
              .then(resolve)
              .catch(reject);
          }, website.waitTime || 2000);
        }
      };

      timeout = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(tabUpdateListener);
        reject(new Error(`Timeout waiting for ${website.name} to load`));
      }, this.TAB_LOAD_TIMEOUT);

      chrome.tabs.onUpdated.addListener(tabUpdateListener);
    });
  }

  /**
   * Inject the AI website script and run it
   */
  private static async injectAndRunScript(
    tabId: number,
    website: AIWebsiteConfig,
    prompt: string
  ): Promise<void> {
    try {
      await this.injectScript(tabId, website);
      await this.waitForScriptLoad();

      const isScriptReady = await this.verifyScriptInjection(tabId);
      if (!isScriptReady) {
        throw new Error(`Script verification failed for ${website.name}`);
      }

      await this.executePromptSubmission(tabId, prompt);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `[ScriptManager] Failed to execute script for ${website.name}:`,
        error
      );
      throw new Error(`Failed to execute script for ${website.name}: ${error}`);
    }
  }

  /**
   * Inject script into the tab
   */
  private static async injectScript(
    tabId: number,
    website: AIWebsiteConfig
  ): Promise<void> {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: [`src/ai-scripts/websites/${website.scriptFile}`],
      });
    } catch (fileError) {
      const scriptContent = await this.getScriptContent(website.scriptFile);

      await chrome.scripting.executeScript({
        target: { tabId },
        func: (script: string) => {
          try {
            // eslint-disable-next-line no-new-func
            const scriptFunc = new Function(script);
            scriptFunc();
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Script execution error:', error);
            throw error;
          }
        },
        args: [scriptContent],
      });
    }
  }

  /**
   * Wait for script to load
   */
  private static async waitForScriptLoad(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, this.SCRIPT_LOAD_DELAY);
    });
  }

  /**
   * Verify script injection was successful
   */
  private static async verifyScriptInjection(tabId: number): Promise<boolean> {
    const checkResults = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => ({
        hasFillFunction: typeof window.fillAndSubmitPrompt === 'function',
        url: window.location.href,
        readyState: document.readyState,
      }),
    });

    const checkResult = checkResults[0]?.result;
    return checkResult?.hasFillFunction === true;
  }

  /**
   * Execute prompt submission
   */
  private static async executePromptSubmission(
    tabId: number,
    prompt: string
  ): Promise<void> {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: (promptText: string) => {
        if (typeof window.fillAndSubmitPrompt === 'function') {
          return window.fillAndSubmitPrompt(promptText);
        }
        return {
          success: false,
          error: 'fillAndSubmitPrompt function not found',
        };
      },
      args: [prompt],
    });

    const result = results[0]?.result;

    if (!result?.success) {
      throw new Error(result?.error || 'Unknown error during script execution');
    }
  }

  /**
   * Get script file content
   */
  static async getScriptContent(scriptFile: string): Promise<string> {
    const possiblePaths = [
      `src/ai-scripts/websites/${scriptFile}`,
      `ai-scripts/websites/${scriptFile}`,
      `websites/${scriptFile}`,
      `dist/src/ai-scripts/websites/${scriptFile}`,
    ];

    const tryPath = async (path: string): Promise<string | null> => {
      try {
        const response = await fetch(chrome.runtime.getURL(path));
        if (response.ok) {
          return await response.text();
        }
        return null;
      } catch {
        return null;
      }
    };

    // Try each path sequentially
    const results = await Promise.allSettled(
      possiblePaths.map((path) => tryPath(path))
    );

    const successfulResult = results.find(
      (result): result is PromiseFulfilledResult<string> =>
        result.status === 'fulfilled' && result.value !== null
    );

    if (successfulResult) {
      return successfulResult.value;
    }

    throw new Error(`Failed to load script file: ${scriptFile}`);
  }
}
