import { CustomJSONSchema } from '../interfaces/ICustomJSONSchema';

export const updateRouteEntitySchema: CustomJSONSchema = {
    title: 'UpdateRouteEntitySchema',
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'UpdateRouteEntitySchema',
    type: 'object',
    required: [ 'name', 'category', 'status', 'tasks', 'duration', 'routeStart', 'routeEnd'],
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
        status: {
            $id: 'status',
            type: 'string',
            enum: ['inactive', 'inProg', 'finished', 'archived']
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