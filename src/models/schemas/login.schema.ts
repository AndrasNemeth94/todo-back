import { pwRegex, emailReg } from '../../utils/regexes';
import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const loginSchema: CustomJSONSchema = {
    title: 'LoginData',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'LoginData',
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            $id: 'email',
            type: 'string',
            minLength: 6,
            pattern: emailReg.source
        },
        password: {
            $id: 'password',
            type: 'string',
            minLength: 6,
            pattern: pwRegex.source
        },
        additionalProperties: false
    }
}