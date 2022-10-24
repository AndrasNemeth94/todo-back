import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';

//services
import { UsersService } from "../../../services/users.service";

export const deleteUserhandler = (usersService: UsersService) => async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.query.id as string;
    try {
        const delRes = await usersService.deleteUserById(userId);
        console.log('UsersRouter::delete() delRes: ', delRes);
        if(delRes instanceof CustomError) {
            res.status(500).send(delRes);
        }
        else {
            res.status(200).send(delRes);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'UsersRouter::DELETE'));
        res.end();
    }
}