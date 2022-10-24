import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { ITaskFilterDetails } from '../../../models/interfaces/ITaskFilterDetails';

//services
import { TasksService } from "../../../services/tasks.service";

export const listTasksHandler = (tasksService: TasksService) => async (req: Request, res: Response, next: NextFunction) => {
    const filterParams: ITaskFilterDetails = req.body as ITaskFilterDetails;
    console.log('TasksRouter filterParams: ', filterParams);
    if(filterParams === undefined) {
        res.status(400).send('No filterParams found!');
        res.end();
    }
    else {
        try {
            const taskList = await tasksService.getTaskList(filterParams);
            console.log('TaskRouter:getTaskList taskList: ', taskList);
            taskList instanceof CustomError ? res.status(500).send(taskList): res.status(200).send(taskList);
        }
        catch(error) {
            res.status(500).send(new CustomError(error.name, error.message, 'TaskRouter::listTasksHandler()'))
            res.end();
        }
    }
}