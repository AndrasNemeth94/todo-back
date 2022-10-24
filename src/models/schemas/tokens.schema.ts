import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';
// import { jwtReg } from '../../utils/regexes';

export const tokensSchema: CustomJSONSchema = {
    title: 'TokenSchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'TokenSchema',
    type: 'object',
    required: ['accessToken', 'refreshToken'],
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