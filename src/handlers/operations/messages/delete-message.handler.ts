import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';

//services
import { MessageService } from '../../../services/messages.service';

export const deleteMessageHandler = (messageService: MessageService) => async (req: Request, res: Response, next: NextFunction) => {
    const messageId = req.query.messageId;
    const userId = req.query.userId;
    console.log('deleteMessageHandler messageId: ', messageId, ', userId: ', userId)
    try {
        const delMessageRes = await messageService.deleteMessage(messageId as string, userId as string);
        delMessageRes instanceof CustomError ? res.status(400).send(delMessageRes): 
        res.status(200).send(`Message on id:${messageId}} has been deleted successfully!`);
        res.end();
    }
    catch(error) {
        res.status(500).send(error);
        res.end();
    }
}