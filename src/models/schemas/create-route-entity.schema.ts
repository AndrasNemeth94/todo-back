import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const createRouteEntitySchema: CustomJSONSchema = {
    title: 'createRouteEntitySchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'createRouteEntitySchema',
    type: 'object',
    required: [ 'name', 'category', 'userId', 'status', 'tasks', 'duration', 'routeStart', 'routeEnd'],
    additionalProperties: false,
    properties: {
        name: {
            $id: 'name',
            type: 'string',
            minLength: 3,
            maxLength: 20
        },
        category: {
            $id: 'category',
            type: 'string',
            enum: ['work', 'health', 'joker', 'learning', 'everyDayLife']
        },
        userId: {
            $id: 'userId',
            type: 'string'
        },
        status: {
            $id: 'status',
            type: 'string',
            enum: ['inactive', 'inProgress', 'finished', 'failed']
        },
        tasks: {
            $id: 'tasks',
            type: 'array',
            minLength: 1,
            items: {
                type: 'string'
            }
        },
        duration: {
            $id: 'duration',
            type: 'number'
        },
        routeStart: {
            $id: 'routeStart',
            type: 'string'
        },
        routeEnd: {
            $id: 'routeEnd',
            type: 'string'
        }
    }
}