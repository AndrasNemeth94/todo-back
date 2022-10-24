import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';

//services
import { TasksService } from "../../../services/tasks.service";

export const deleteTaskHandler = (tasksService: TasksService) => async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id as string;
    try {
        const delRes = await tasksService.deleteTask(id);
        if(delRes instanceof CustomError) {
            res.status(500).send(delRes);
        }
        else {
            res.status(200).send(delRes);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'TaskRouter::deleteTaskHandler()'));
        res.end();
    }
}