import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';

//services
import { UsersService } from "../../../services/users.service";

export const getUserHandler = (usersService: UsersService) => async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.query.id as string;
    try {
        if(userId != null) {
            const user = await usersService.getUserById(userId);
            res.status(200).send(user);
        }
        else {
            const err = new CustomError('ClientError', 'No user id to search by!', `UserRoutes::users/${userId || 'id'}`);
            res.status(400).send(err);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'UsersRouter::GETBYID'));
        res.end();
    }
}