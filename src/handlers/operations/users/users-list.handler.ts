import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { IUser } from '../../../models/interfaces/IUser';

//services
import { UsersService } from '../../../services/users.service';

export const usersListHandler = (usersService: UsersService) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const listRes: CustomError | IUser [] = await usersService.getUsers();
        console.log('HANDLER listRES: ', listRes);
        res.send(listRes);
        res.end();
    }
    catch(error) {
        console.log('HANDLER CATCHED ERROR: ', error);
        res.status(500).send(new CustomError(error.name, error.message, 'usersListHandler'));
        res.end();
    }
}