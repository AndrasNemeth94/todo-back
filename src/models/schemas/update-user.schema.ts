import { emailReg } from '../../utils/regexes';
import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const updateUserSchema: CustomJSONSchema = {
    title: 'updateUserSchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'updateUserSchema',
    type: 'object',
    required: [ 'id', 'firstName', 'lastName', 'email', 'username','routeIds', 'permissions', 'securityQuestion', 'answer', 'timezone'],
    additionalProperties: false,
    properties: {
        id: {
            $id: 'id',
            type: 'string',
            minLength: 5
        },
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
        routeIds: {
            $id: 'routeIds',
            type: 'array',
            default: [],
            items: {
                type: 'string'
            },
        },
        profileImg: {
            $id: 'profileImg',
            type: 'string',
            default: 'nourl'
        },
        securityQuestion: {
            $id: 'securityQuestion',
            type: 'string',
            minLength: 10,
            maxLength: 30,
            default: 'How old are you?'
        },
        answer: {
            $id: 'answer',
            type: 'string',
            minLength: 2,
            maxLength: 30,
            default: 'no security answer!'
        },
        timezone: {
            $id: 'timezone',
            type: 'string',
            default: 'Europe/Budapest',
            enum: [
            'Europe/Amsterdam',
            'Europe/Andorra',
            'Europe/Astrakhan',
            'Europe/Athens',
            'Europe/Belfast',
            'Europe/Belgrade',
            'Europe/Berlin',
            'Europe/Bratislava',
            'Europe/Brussels',
            'Europe/Bucharest',
            'Europe/Budapest',
            'Europe/Busingen',
            'Europe/Chisinau',
            'Europe/Copenhagen',
            'Europe/Dublin',
            'Europe/Gibraltar',
            'Europe/Guernsey',
            'Europe/Helsinki',
            'Europe/Isle_of_Man',
            'Europe/Istanbul',
            'Europe/Jersey',
            'Europe/Kaliningrad',
            'Europe/Kiev',
            'Europe/Kirov',
            'Europe/Lisbon',
            'Europe/Ljubljana',
            'Europe/London',
            'Europe/Luxembourg',
            'Europe/Madrid',
            'Europe/Malta',
            'Europe/Mariehamn',
            'Europe/Minsk',
            'Europe/Monaco',
            'Europe/Moscow',
            'Europe/Nicosia',
            'Europe/Oslo',
            'Europe/Paris',
            'Europe/Podgorica',
            'Europe/Prague',
            'Europe/Riga',
            'Europe/Rome',
            'Europe/Samara',
            'Europe/San_Marino',
            'Europe/Sarajevo',
            'Europe/Saratov',
            'Europe/Simferopol',
            'Europe/Skopje',
            'Europe/Sofia',
            'Europe/Stockholm',
            'Europe/Tallinn',
            'Europe/Tirane',
            'Europe/Tiraspol',
            'Europe/Ulyanovsk',
            'Europe/Uzhgorod',
            'Europe/Vaduz',
            'Europe/Vatican',
            'Europe/Vienna',
            'Europe/Vilnius',
            'Europe/Volgograd',
            'Europe/Warsaw',
            'Europe/Zagreb',
            'Europe/Zaporozhye',
            'Europe/Zurich'
            ]
        },
    }
}