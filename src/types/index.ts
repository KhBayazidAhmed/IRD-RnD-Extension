// Re-export the new AI website config as the main interface
import { type AIWebsiteConfig } from '../ai-scripts/config';

export type AIWebsite = AIWebsiteConfig;

export interface SubmitMessage {
  action: string;
  websites: AIWebsite[];
  prompt: string;
}

export interface PopupState {
  selectedWebsites: string[];
  prompt: string;
  isSubmitting: boolean;
  error: string;
}
