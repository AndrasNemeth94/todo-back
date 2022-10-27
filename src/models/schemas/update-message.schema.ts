import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const updateMessageSchema: CustomJSONSchema = {
    title: 'updateMessageSchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'UpdateMessageSchema',
    type: 'object',
    required: ['isStatusUpdate', 'userId', 'messageId'],
    properties: {
        isStatusUpdate: {
            $id: 'isStatusUpdate',
            type: 'boolean',
        },
        userId: {
            $id: 'userId',
            type: 'string',
            minLength: 6,
        },
        messageId: {
            $id: 'messageId',
            type: 'string',
            minLength: 6
        },
        newMessage: {
            $id: 'newMessage',
            type: 'object',
            properties: {
                $id: {
                    $id: 'id',
                    type: 'string'
                },
                senderId: {
                    $id: 'senderId',
                    type: 'string',
                    minLength: 6,
                },
                receiverId: {
                    $id: 'receiverId',
                    type: 'string',
                    minLength: 6,
                },
                content: {
                    $id: 'content',
                    type: 'string',
                    minLength: 1
                },
                timestamp: {
                    $id: 'timestamp',
                    type: 'string',
                    minLength: 20
                },
                seen: {
                    $id: 'string',
                    type: 'boolean'
                }
            }
        },
        additionalProperties: false
    }
}