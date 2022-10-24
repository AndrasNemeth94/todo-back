import { Express } from 'express';

//models
import { validateJSONSchema } from '../handlers/validators/schema.validator';
import { exportSchemas } from '../models/schemas/export-schemas';

//services
import { AuthService } from '../services/auth.service';
import { RouteEntityService } from '../services/route-entity.service';

//handlers
import { createRouteEntityHandler } from '../handlers/operations/route-entities/create-route-entity.handler';
import { deleteRouteEntityHandler } from '../handlers/operations/route-entities/delete-route-entity.handler';
import { updateRouteEntityHandler } from '../handlers/operations/route-entities/update-route-entity.handler';
import { getRouteEntityById } from '../handlers/operations/route-entities/get-route-by-id.handler';
import { listRouteEntities } from '../handlers/operations/route-entities/list-route-entities.handler';

function routerEntityRouter(app: Express, routeEntityService: RouteEntityService, authService: AuthService) {

    app.route('/api/route-entity/list').get(
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    listRouteEntities(routeEntityService))

    app.route('/api/route-entity/:id').get(
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    getRouteEntityById(routeEntityService))

    app.route('/api/route-entity/create').post(
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    validateJSONSchema(exportSchemas.createRouteEntitySchema, false),
    createRouteEntityHandler(routeEntityService))

    app.route('/api/route-entity/update/:id').post(
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    validateJSONSchema(exportSchemas.updateRouteEntitySchema, false),
    updateRouteEntityHandler(routeEntityService))

    app.route('/api/route-entity/delete/:id').delete(
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    deleteRouteEntityHandler(routeEntityService))
}
export { routerEntityRouter };