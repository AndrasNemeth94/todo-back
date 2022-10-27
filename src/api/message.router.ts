import { Express } from 'express';

//models
import { validateJSONSchema } from '../handlers/validators/schema.validator';
import { exportSchemas } from '../models/schemas/export-schemas';

//handlers
import { createMessageHandler } from '../handlers/operations/messages/create-message.handler';
import { listMessagesHandler } from '../handlers/operations/messages/get-list.handler';
import { getSingleMessageHandler } from '../handlers/operations/messages/get-single-message.handler';
import { updateMessageHandler } from '../handlers/operations/messages/update-message.handler';
import { deleteMessageHandler } from '../handlers/operations/messages/delete-message.handler';

//services
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/messages.service';

function messagesRouter(app: Express, authService: AuthService, messageService: MessageService) {

    app.post('/api/messages/list',
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    listMessagesHandler(messageService))

    app.get('/api/messages/get',
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    getSingleMessageHandler(messageService)),

    app.post('/api/messages/create',
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    validateJSONSchema(exportSchemas.messageSchema, false),
    createMessageHandler(messageService)),

    app.post('/api/messages/update/:id',
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    validateJSONSchema(exportSchemas.updateMessageSchema, false),
    updateMessageHandler(messageService))

    app.delete('/api/messages/delete',
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    deleteMessageHandler(messageService))
}

export { messagesRouter };