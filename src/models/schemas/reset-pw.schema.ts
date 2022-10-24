import { pwRegex } from '../../utils/regexes';
import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const resetPwSchema: CustomJSONSchema = {
    title: 'resetPwSchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'resetPwSchema',
    type: 'object',
    required: ['id', 'password', 'answer'],
    properties: {
        id: {
            $id: 'id',
            type: 'string',
            maxLength: 20,
            minLength: 19
        },
        password: {
            $id: 'password',
            type: 'string',
            pattern: pwRegex.source
        },
        answer: {
            $id: 'answer',
            type: 'string',
            minLength: 2,
            maxLength: 30
        },
        additionalProperties: false
    }
}