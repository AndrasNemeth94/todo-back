import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { ITask } from '../../../models/interfaces/ITask';

//services
import { TasksService } from "../../../services/tasks.service";

export const updateTaskHandler = (tasksService: TasksService) => async (req: Request, res: Response, next: NextFunction) => {
    let taskToUpdate: ITask = req.body;
    try {
        const updatedTask = await tasksService.updateTask(taskToUpdate);
        if(updatedTask instanceof CustomError) {
            res.status(500).send(updatedTask);
        }
        else {
            res.status(200).send(updatedTask);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'TaskRouter::updateTaskHandler()'));
        res.end();
    }
}