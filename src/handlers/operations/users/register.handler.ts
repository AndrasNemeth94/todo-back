import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { IRegisterUser } from '../../../models/interfaces/IRegisterUser';

//services
import { UsersService } from "../../../services/users.service";

export const registerUserHandler = (usersService: UsersService) => async (req: Request, res: Response, next: NextFunction) => {
    let newUser = req.body as IRegisterUser;
    let err;
    if(newUser != null) {
        const createdUserId = await usersService.createUser(newUser);
        if(createdUserId instanceof CustomError) {
            res.status(400).send(createdUserId);
        }
        else {
            res.status(200).send(createdUserId);
        }
        res.end();
    }
    else {
        err = new CustomError('ClientError','No object has been found in request body!', 'UsersRoute:users/create');
        res.status(400).send(err);
        res.end();
    }
}