import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const requestSchema: CustomJSONSchema = {
    title: 'RequestSchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'RequestSchema',
    type: 'object',
    required: ['x_client_type', 'x_client_name', 'x_client_version'],
    properties: {
        x_client_type: {
            $id: 'client_type',
            type: 'string',
            pattern: process.env.X_CLIENT_WEB || process.env.X_CLIENT_MOBILE
        },
        x_client_name: {
            $id: 'client_name',
            type: 'string',
            pattern: process.env.X_CLIENT_NAME
        },
        x_client_version: {
            $id: 'client_version',
            type: 'string',
            pattern: process.env.X_CLIENT_VERSION
        },
        additionalProperties: true
    }
}