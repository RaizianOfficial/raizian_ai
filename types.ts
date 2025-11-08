
export enum MessageAuthor {
  USER = 'user',
  MODEL = 'model',
}

export interface DisplayMessage {
  author: MessageAuthor;
  text: string;
}
