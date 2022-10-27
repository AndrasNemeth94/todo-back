import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';

//services
import { MessageService } from '../../../services/messages.service';

export const getSingleMessageHandler = (messageService: MessageService) => async (req: Request, res: Response, next: NextFunction) => {
    const messageId = req.query.messageId;
    console.log('getSingleMessageHandler messageId: ', messageId)
    try {
        const message = await messageService.getMessageById(messageId as string);
        message instanceof CustomError ? res.status(400).send(message): res.status(200).send(message);
        res.end();
    }
    catch(error) {
        res.status(500).send(error);
        res.end();
    }
}