import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';

//services
import { TasksService } from "../../../services/tasks.service";

export const getTaskHandler = (tasksService: TasksService) => async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.query.id as string;
    console.log('GetTaskbyId id: ', taskId);
    try {
        const task = await tasksService.getTaskById(taskId);
        if(task instanceof CustomError) {
            res.status(500).send(task);
        }
        else {
            res.status(200).send(task);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'TaskRouter::getTaskHandler()'));
        res.end();
    }
}