import { Express} from "express";

//models
import { validateJSONSchema } from "../handlers/validators/schema.validator";
import { exportSchemas } from "../models/schemas/export-schemas";

//handlers
import { deleteTaskHandler } from "../handlers/operations/tasks/delete-task.handler";
import { updateTaskHandler } from "../handlers/operations/tasks/update-task.handler";
import { getTaskHandler } from "../handlers/operations/tasks/get-task.handler";
import { listTasksHandler } from "../handlers/operations/tasks/list-tasks.handler";
import { createTaskHandler } from "../handlers/operations/tasks/create-task.handler";

//services
import { AuthService } from "../services/auth.service";
import { TasksService } from "../services/tasks.service";
import { RouteEntityService } from "../services/route-entity.service";



function taskRouter(app: Express, taskService: TasksService, routeEntityService: RouteEntityService,authService: AuthService) {

    app.route('/api/tasks/get/:id').get(
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    getTaskHandler(taskService))

    app.route('/api/tasks/list').post(
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    validateJSONSchema(exportSchemas.taskFilterDetailsSchema, false),
    listTasksHandler(taskService))

    app.route('/api/tasks/create').post(
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    validateJSONSchema(exportSchemas.taskSchema, false),
    createTaskHandler(taskService, routeEntityService))

    app.route('/api/tasks/update').post(
    validateJSONSchema(exportSchemas.requestSchema, true),
    validateJSONSchema(exportSchemas.updateTaskSchema, false),
    authService.verifyToken.bind(authService),
    updateTaskHandler(taskService))

    app.route('/api/tasks/delete/:id').delete(
    validateJSONSchema(exportSchemas.requestSchema, true),
    authService.verifyToken.bind(authService),
    deleteTaskHandler(taskService))
}
export { taskRouter };