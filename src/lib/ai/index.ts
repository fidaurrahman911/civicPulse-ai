export * from './types';
export * from './demo-provider';
import { demoAiProvider } from './demo-provider';
import { CivicAIProvider } from './types';

// In future production environments, this can dynamically swap to a server-side Gemini/Vision provider
export const civicAi: CivicAIProvider = demoAiProvider;
