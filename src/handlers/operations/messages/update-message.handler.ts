import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { IUpdateMessage } from '../../../models/interfaces/IUpdateMessage';

//services
import { MessageService } from '../../../services/messages.service';

export const updateMessageHandler = (messageService: MessageService) => async (req: Request, res: Response, next: NextFunction) => {
    let params: IUpdateMessage = req.body;
    console.log('updateMessageHandler params: ', params);
    try {
        const updateMessageRes = await messageService.updateMessage(params);
        updateMessageRes instanceof CustomError ? res.status(400).send(updateMessageRes): res.status(200).send(updateMessageRes);
        res.end();
    }
    catch(error) {
        res.status(500).send(error);
        res.end();
    }
}