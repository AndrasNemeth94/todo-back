import { loginSchema } from './login.schema';
import { requestSchema } from './request.schema';
import { tokensSchema } from './tokens.schema';
import { userSchema } from './user.schema';
import { registerUserSchema } from './register-user.schema';
import { resetPwSchema } from './reset-pw.schema';
import { updateUserSchema } from './update-user.schema';
import { taskSchema } from './task.schema';
import { taskFilterDetailsSchema } from './task-filter-details.schema';
import { updateTaskSchema } from './update-task.schema';
import { createRouteEntitySchema } from './create-route-entity.schema';
import { updateRouteEntitySchema } from './update-route-entity.schema';

export const exportSchemas = {
    loginSchema,
    requestSchema,
    tokensSchema,
    userSchema,
    registerUserSchema,
    resetPwSchema,
    updateUserSchema,
    taskSchema,
    taskFilterDetailsSchema,
    updateTaskSchema,
    createRouteEntitySchema,
    updateRouteEntitySchema
};