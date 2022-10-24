import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';

//services
import { UsersService } from "../../../services/users.service";
import { IResetPassword } from '../../../models/interfaces/IResetPassword';

export const resetPasswordHandler = (usersService: UsersService) => async (req: Request, res: Response, next: NextFunction) => {
    const resetPw: IResetPassword = {
        id: req.body.id,
        answer: req.body.answer,
        password: req.body.password
    }
    try {
        const user = await usersService.resetPassword(resetPw);
        if(user instanceof CustomError) {
            res.status(400).send(user);
        }
        else {
            res.status(200).send(user);
        }
        res.end();
    }
    catch(error) {
        res.status(400).send(new CustomError(error.name, error.message, 'UsersRoute::resetPasswordHandler()'));
        res.end();
    }
}