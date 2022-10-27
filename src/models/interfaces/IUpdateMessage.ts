import { IMessage } from "./IMessage";

export interface IUpdateMessage {
    isStatusUpdate: boolean;
    userId: string;
    messageId: string;
    newMessage?: IMessage;
}