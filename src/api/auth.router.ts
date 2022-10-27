import { Express } from 'express';

//shemas
import { exportSchemas } from '../models/schemas/export-schemas';

//services
import { AuthService } from '../services/auth.service';

//handlers
import { validateJSONSchema } from '../handlers/validators/schema.validator';
import { userAuthHandler } from '../handlers/operations/auth/user-auth-handler';
import { tokenRefreshHandler } from '../handlers/operations/auth/token-refresh.handler';
import cors from 'cors';


function authRouter(app: Express, authService: AuthService) {

    app.post('/api/login',
    cors(),
    validateJSONSchema(exportSchemas.requestSchema, true),
    validateJSONSchema(exportSchemas.loginSchema, false),
    userAuthHandler(authService)),

    app.post('/api/refresh',
    cors(),
    validateJSONSchema(exportSchemas.tokensSchema, false),
    tokenRefreshHandler(authService))
}
export { authRouter };