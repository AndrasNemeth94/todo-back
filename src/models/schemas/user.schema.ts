import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const userSchema: CustomJSONSchema = {
    title: 'UserSchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'UserSchema',
    type: 'object',
    required: ['id', 'firstName', 'lastName', 'email'],
    properties: {
        accessToken: {
            $id: 'accessToken',
            type: 'string',
            // pattern: jwtReg.source
        },
        refreshToken: {
            $id: 'refreshToken',
            type: 'string',
            // pattern: jwtReg.source
        },
        additionalProperties: false
    }
}