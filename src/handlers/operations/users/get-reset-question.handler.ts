import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { emailReg } from '../../../utils/regexes';

//services
import { UsersService } from '../../../services/users.service';


export const getResetQuestionHandler = (userService: UsersService) => async (req: Request, res: Response, next: NextFunction) => {
    console.log('getResetQuestionHandler email: ' + req.body.email);
    try {
        const email = req.body.email as string;
        const match = emailReg.test(email);
        if(!match) {
            res.status(400).send(new CustomError('ClientError', 'Email doesnt match regex!', 'getResetQuestionHandler()'));
        }
        else if(match) {
            const userSecurityQuestion = await userService.getUserByEmail(email);
            res.status(200).send(userSecurityQuestion);
        }
        res.end();
    }
    catch(error) {
        if(error instanceof CustomError) {
            res.send(400).send(error);
        }
        res.status(400).send(new CustomError(error.name, error.message, 'getResetQuestionHandler()'));
        res.end();
    }
}