import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { ICreateTask } from '../../../models/interfaces/ICreateTask';

//services
import { TasksService } from "../../../services/tasks.service";
import { RouteEntityService } from '../../../services/route-entity.service';

export const createTaskHandler = (tasksService: TasksService, routeEntityService: RouteEntityService) => async (req: Request, res: Response, next: NextFunction) => {
    let newTask: ICreateTask = req.body;
    try {
        const routeEntity = await routeEntityService.getRouteEntityById(newTask.routeId);
        if(routeEntity instanceof CustomError) {
            res.status(400).send(routeEntity);
        }
        else {
            const createdTask = await tasksService.createTask(newTask);
            if(createdTask instanceof CustomError) {
                res.status(500).send(createdTask);
            }
            else {
                res.status(200).send(createdTask);
            }
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'TaskRoute::CreateTask'));
        res.end();
    }
}