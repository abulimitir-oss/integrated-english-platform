export type OpenAIRole = 'system' | 'user' | 'assistant';

export interface DialogueTurn {
  speaker: 'user' | 'assistant';
  text: string;
}

export interface DialogueState {
  context: string;
  history: DialogueTurn[];
}