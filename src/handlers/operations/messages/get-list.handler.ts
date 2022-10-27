import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { IMessageQueryParams } from '../../../models/interfaces/IMessageQueryParams';

//services
import { MessageService } from '../../../services/messages.service';

export const listMessagesHandler = (messageService: MessageService) => async (req: Request, res: Response, next: NextFunction) => {
    const params = req.body;
    console.log('listMessagesHandler messageId: ', params)
    try {
        const messageList = await messageService.listMessagesForUser(params.userId, params.queryParams as IMessageQueryParams);
        messageList instanceof CustomError ? res.status(400).send(messageList): res.status(200).send(messageList);
        res.end();
    }
    catch(error) {
        res.status(500).send(error);
        res.end();
    }
}