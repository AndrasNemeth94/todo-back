import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const updateTaskSchema: CustomJSONSchema = {
    title: 'UpdateTaskSchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'UpdateTaskSchema',
    type: 'object',
    required: [ 'id', 'name', 'status', 'duration', 'routeId', 'start', 'end'],
    additionalProperties: false,
    properties: {
        id: {
            $id: 'id',
            type: 'string'
        },
        name: {
            $id: 'name',
            type: 'string',
            minLength: 2,
            maxLength: 20
        },
        status: {
            $id: 'status',
            type: 'string',
            enum: ['inactive', 'inProg', 'failed', 'completed']
        },
        routeId: {
            $id: 'routeId',
            type: 'string'
        },
        description: {
            $id: 'description',
            type: 'string',
            minLength: 3,
            maxLength: 40
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