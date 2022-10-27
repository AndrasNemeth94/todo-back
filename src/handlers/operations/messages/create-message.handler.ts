import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { IMessage } from '../../../models/interfaces/IMessage';

//services
import { MessageService } from '../../../services/messages.service';

export const createMessageHandler = (messageService: MessageService) => async (req: Request, res: Response, next: NextFunction) => {
    let newMessage: IMessage = req.body;
    try {
        const createMessageRes = await messageService.createMessage(newMessage);
        createMessageRes instanceof CustomError ? res.status(400).send(createMessageRes): res.status(200).send(createMessageRes);
        res.end();
    }
    catch(error) {
        res.status(500).send(error);
        res.end();
    }
}