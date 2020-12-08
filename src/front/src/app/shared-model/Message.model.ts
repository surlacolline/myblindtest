export interface IMessage {
  id: number;
  pseudo: string;
  message: string;
  isUserMessage: boolean;
}

class Message implements IMessage {
  public id!: number;
  public pseudo!: string;
  public message!: string;
  public isUserMessage: boolean;

  constructor(message?: IMessage) {
    if (message) {
      this.id = message.id;
      this.pseudo = message.pseudo;
      this.message = message.message;
      this.isUserMessage = message.isUserMessage;
    }
  }
}

export default Message;
