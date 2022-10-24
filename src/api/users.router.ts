//express
import { Express } from 'express';

//schemas
import { exportSchemas } from '../models/schemas/export-schemas';

//services
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { FileService } from '../services/file.service';

//handlers
import { validateJSONSchema } from '../handlers/validators/schema.validator';
import { usersListHandler } from '../handlers/operations/users/users-list.handler';
import { registerUserHandler } from '../handlers/operations/users/register.handler';
import { getUserHandler } from '../handlers/operations/users/get-user.handler';
import { deleteUserhandler } from '../handlers/operations/users/delete-user.handler';
import { getResetQuestionHandler } from '../handlers/operations/users/get-reset-question.handler';
import { resetPasswordHandler } from '../handlers/operations/users/reset-pw.handler';
import { userUpdateHandler } from '../handlers/operations/users/update.handler';


function userRoutes(app: Express, usersService: UsersService, authService: AuthService, fileService: FileService) {

    app.route('/api/users/list').get(
        validateJSONSchema(exportSchemas.requestSchema, true),
        authService.verifyToken.bind(authService),
        usersListHandler(usersService))

    app.route('/api/users/register').post(
        validateJSONSchema(exportSchemas.requestSchema, true),
        validateJSONSchema(exportSchemas.registerUserSchema, false),
        registerUserHandler(usersService)
    )
            
    app.route('/api/users/get/:id').get(
        validateJSONSchema(exportSchemas.requestSchema, true),
        authService.verifyToken.bind(authService),
        getUserHandler(usersService)
    )

    app.route('/api/users/delete/:id').delete(
        validateJSONSchema(exportSchemas.requestSchema, true),
        authService.verifyToken.bind(authService),
        deleteUserhandler(usersService)
    )

    app.route('/api/users/update/:id').post(
        validateJSONSchema(exportSchemas.requestSchema, true),
        authService.verifyToken.bind(authService),
        fileService.getMulter().single('file'),
        validateJSONSchema(exportSchemas.updateUserSchema, false),
        userUpdateHandler(usersService, fileService)
    )

    app.route('/api/users/securityQuestion').post(
        validateJSONSchema(exportSchemas.requestSchema, true),
        getResetQuestionHandler(usersService)
    )

    app.route('/api/users/resetpw').post(
        validateJSONSchema(exportSchemas.requestSchema, true),
        validateJSONSchema(exportSchemas.resetPwSchema, false),
        resetPasswordHandler(usersService)
    )
}
export { userRoutes };