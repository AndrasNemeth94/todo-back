import { emailReg, pwRegex } from '../../utils/regexes';
import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const registerUserSchema: CustomJSONSchema = {
    title: 'RegisterUserSchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'RegisterUserSchema',
    type: 'object',
    required: [ 'firstName', 'lastName', 'email', 'password', 'username', 'permissions', 'securityQuestion', 'answer'],
    additionalProperties: false,
    properties: {
        firstName: {
            $id: 'firstName',
            type: 'string',
            minLength: 3,
            maxLength: 20
        },
        lastName: {
            $id: 'lastName',
            type: 'string',
            minLength: 3,
            maxLength: 20
        },
        username: {
            $id: 'username',
            type: 'string',
            minLength: 3,
            maxLength: 12
        },
        email: {
            $id: 'email',
            type: 'string',
            pattern: emailReg.source
        },
        password: {
            $id: 'password',
            type: 'string',
            pattern: pwRegex.source
        },
        permissions: {
            $id: 'permissions',
            type: 'array',
            default: ['user'],
            minItems: 1,
            items: { '$ref':'#/definitions/permissionEnum' },
            definitions: {
                permissionEnum: {
                    type: 'string',
                    enum: ['admin', 'user']
                }
            }
        },
        securityQuestion: {
            $id: 'securityQuestion',
            type: 'string',
            minLength: 10,
            maxLength: 30
        },
        answer: {
            $id: 'answer',
            type: 'string',
            minLength: 2,
            maxLength: 30
        }
    }
}