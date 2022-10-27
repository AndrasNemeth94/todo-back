import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const messageSchema: CustomJSONSchema = {
    title: 'messageSchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'MessageSchema',
    type: 'object',
    required: ['senderId', 'receiverId', 'content', 'timestamp', 'seen'],
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
        },
        additionalProperties: true
    }
}