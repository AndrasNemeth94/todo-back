import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const taskFilterDetailsSchema: CustomJSONSchema = {
    title: 'TaskFilterDetailsSchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'TaskFilterDetailsSchema',
    type: 'object',
    required: [ 'routeId'],
    additionalProperties: false,
    properties: {
        routeId: {
            $id: 'routeId',
            type: 'string'
        },
        status: {
            $id: 'status',
            type: 'string',
            enum: ['inactive', 'inProg', 'failed', 'completed']
        },
        duration: {
            $id: 'duration',
            type: 'number',
            minimum: 1
        },
        start: {
            $id: 'start',
            type: 'string',
        },
        end: {
            $id: 'end',
            type: 'string'
        }
    }
}