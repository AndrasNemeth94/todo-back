import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { IUpdateUser } from '../../../models/interfaces/IUpdateUser';

//servcies
import { UsersService } from '../../../services/users.service';
import { FileService } from '../../../services/file.service';
import { checkObjProperties, ObjType } from '../../../utils/type-guard';

export const userUpdateHandler = (usersService: UsersService, fileService: FileService) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        let protoUser = req.body as IUpdateUser;
        console.log('userUpdateHandler() protoUser: ', protoUser);

        if(req.file) {
            let file = req.file;
            console.log('UsersRouter::update() file: ', file);

            fileService.setUserId(protoUser.id);
            const uploadRes = await fileService.uploadPfpImage(file);
            console.log('UsersRouter::update() fileURL: ', uploadRes);

            if(uploadRes instanceof CustomError) {
                res.status(500).send(uploadRes);
            }
            protoUser.profileImg = uploadRes as string;
            console.log('UserRouter::update() user with updated profileImgUrl: ', protoUser);
        }
        const updateRes: string | CustomError = await usersService.updateUserById(protoUser.id, protoUser);
        if(updateRes instanceof CustomError) {
            res.status(400).send(updateRes);
        }
        else {
            res.status(200).send(`User with id: ${updateRes} has been updated successfully!`);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'UsersRouter::userUpdateHandler()'));
        res.end();
    }
}
