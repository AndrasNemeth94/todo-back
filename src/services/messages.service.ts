import { CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, Firestore, QuerySnapshot, WriteResult } from 'firebase-admin/firestore';

//models
import { IMessage } from '../models/interfaces/IMessage';
import { IMessageQueryParams } from '../models/interfaces/IMessageQueryParams';
import { CustomError } from '../models/custorm-error';
import { IUpdateMessage } from '../models/interfaces/IUpdateMessage';

export class MessageService {

    messagesCollection: CollectionReference;
    db: Firestore;
    
    constructor(db: Firestore) {
        this.db = db;
        this.messagesCollection = this.db.collection('messages');
    }

    async createMessage(newMessage: IMessage): Promise<CustomError | DocumentReference> {
        console.log('MessageService::createMessage() newMessage: ', newMessage);
        try {
            const createRes = await this.messagesCollection.add(newMessage);
            console.log('MessageService::createMessage() createRes: ', createRes);
            return createRes;
        }
        catch(error) {
            return new CustomError('ClientError', error.message, 'MessageService::createMessage()');
        }
    }

    async deleteMessage(messageId: string, userId: string): Promise<CustomError | WriteResult> {
        console.log('MessageService::deleteMessage() messageId: ', messageId, ', userId: ', userId);
        try {
           const docRef = this.messagesCollection.doc(messageId);
           const msg = await (await docRef.get()).data() as IMessage;
           if(msg.senderId === userId) {
            return await docRef.delete();
           }
           else {
            throw new CustomError('ClientError', 'Given messages senderId doesnt match userId', 'MessageService::deleteMessage()');
           }
        }
        catch(error) {
            if(error instanceof CustomError) {
                return error;
            }
            return new CustomError('ClientError', error.message, 'MessageService::deleteMessage()');
        }
    }

    async updateMessage(params: IUpdateMessage): Promise<CustomError | WriteResult> {
        console.log('MessageService::updateMessage() params: ', params);
        try {
            const docRef = await this.messagesCollection.doc(params.messageId);
            const msg = await (await docRef.get()).data() as IMessage;
            if(params.isStatusUpdate) {
                const seenRes = await docRef.update({ seen: true });
                return seenRes;
            }
            else if(params.isStatusUpdate === false && msg.senderId === params.userId) {
                const updateRes = await docRef.update(params?.newMessage as {[x: string]: any});
                return updateRes;
            }
            else {
                throw new CustomError('ClientError', 'Messages senderId and given userId doesnt match!', 'MessageService::updateMessage()');
            }
        }
        catch(error) {
            if(error instanceof CustomError) {
                return error;
            }
            return new CustomError('ClientError', error.message, 'MessageService::updateMessage()');
        }
    }

    async getMessageById(messageId: string): Promise<IMessage | CustomError> {
        console.log('MessageService::getMessageById() messageId: ', messageId);
        try {
            let msg: IMessage;
            const docRef = this.messagesCollection.doc(messageId);
            const getRes = docRef.get().then((res: DocumentSnapshot<DocumentData>) => {
                if(!res.exists) {
                    return new CustomError('ClientError', 'Message with the given id doesnt exist!', 'MessageService::getMessageById()');
                }
                else if(res.exists){
                    msg = res.data() as IMessage;
                    msg.id = messageId;
                    return msg;
                }
            });
            return getRes;
        }
        catch(error) {
            if(error instanceof CustomError) {
                return error;
            }
            else {
                return new CustomError('ClientError', error.message, 'MessageService::getMessageById()');
            }
        }
    }

    async listMessagesForUser(userId: string, queryParams: IMessageQueryParams): Promise<IMessage[] | CustomError> {
        console.log('MessageService::listMessagesForUser() userId: ', userId, ', queryParams: ', queryParams);
        try {
            let matchedMessages: IMessage [] = [];
            const queryAllMsg = await this.messagesCollection.where(queryParams.isSender ? 'senderId': 'receiverId', '==', userId).get();
            if(queryAllMsg.empty) {
                throw new CustomError('ClientError', 'There are no messages assigned to this user: ' + userId + '!', 'MessageService::listMessagesForUser()');
            }
            queryAllMsg.docs.forEach((msgDoc, i: number) => {
                matchedMessages.push(msgDoc.data() as IMessage);
            })
            console.log('MessageService::listMessagesForUser() matchedMessages: ', matchedMessages);
            if(queryParams?.seen === true) {
                matchedMessages = matchedMessages.filter((msg) => msg.seen);
            }
            if(queryParams?.seen === false) {
                matchedMessages = matchedMessages.filter((msg) => !msg.seen);
            }
            console.log('MessageService::listMessagesForUser() matchedMessages after filter: ', matchedMessages);
            return matchedMessages;
        }
        catch(error) {
            if(error instanceof CustomError) {
                return error;
            }
            return new CustomError('ClientError', error.message, 'MessageService::listMessagesForUser()');
        }
    }
}