/**
 * AI Websites Configuration
 * Simple setup - each AI website has its own JavaScript file to run
 */

export interface AIWebsiteConfig {
  id: string;
  name: string;
  url: string;
  description?: string;
  category: 'general' | 'coding' | 'search' | 'creative' | 'writing';
  isEnabled: boolean;
  icon?: string;
  // The JavaScript file to run on this website
  scriptFile: string;
  // Wait time before running the script (in milliseconds)
  waitTime?: number;
}

/**
 * List of AI websites with their corresponding script files
 * To add a new AI website:
 * 1. Add configuration here
 * 2. Create a corresponding JavaScript file in the websites/ folder
 */
export const AI_WEBSITES: AIWebsiteConfig[] = [
  {
    id: 'test-simple',
    name: 'Test Script',
    url: 'https://example.com',
    description: 'Simple test to verify script injection',
    category: 'general',
    isEnabled: true,
    scriptFile: 'test-simple.js',
    waitTime: 1000,
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'OpenAI ChatGPT',
    category: 'general',
    isEnabled: true,
    scriptFile: 'chatgpt.js',
    waitTime: 3000,
  },
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai',
    description: 'Anthropic Claude',
    category: 'general',
    isEnabled: true,
    scriptFile: 'claude.js',
    waitTime: 3000,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com',
    description: 'Google Gemini',
    category: 'general',
    isEnabled: true,
    scriptFile: 'gemini.js',
    waitTime: 2000,
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai',
    description: 'Perplexity AI Search',
    category: 'search',
    isEnabled: true,
    scriptFile: 'perplexity.js',
    waitTime: 2000,
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    url: 'https://copilot.microsoft.com',
    description: 'Microsoft Copilot',
    category: 'general',
    isEnabled: true,
    scriptFile: 'copilot.js',
    waitTime: 2000,
  },
  {
    id: 'custom-script',
    name: 'Custom Script Runner',
    url: 'https://example.com',
    description: 'Run custom JavaScript on any website',
    category: 'general',
    isEnabled: false,
    scriptFile: 'custom-script.js',
    waitTime: 1000,
  },
  {
    id: 'simple-script',
    name: 'Simple JS Runner',
    url: 'about:blank',
    description: 'Easy JavaScript execution with utilities',
    category: 'general',
    isEnabled: true,
    scriptFile: 'simple-script.js',
    waitTime: 500,
  },
];

/**
 * Get enabled websites
 */
export const getEnabledWebsites = (): AIWebsiteConfig[] =>
  AI_WEBSITES.filter((website) => website.isEnabled);

/**
 * Get website by ID
 */
export const getWebsiteById = (id: string): AIWebsiteConfig | undefined =>
  AI_WEBSITES.find((website) => website.id === id);

/**
 * Get websites by category
 */
export const getWebsitesByCategory = (category: string): AIWebsiteConfig[] =>
  AI_WEBSITES.filter(
    (website) => website.category === category && website.isEnabled
  );

/**
 * Get all categories
 */
export const getCategories = (): string[] => {
  const categories = new Set(AI_WEBSITES.map((website) => website.category));
  return Array.from(categories).sort();
};
