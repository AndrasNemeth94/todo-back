import { Request, Response, NextFunction } from 'express';
import Ajv, { ErrorObject }  from 'ajv';

//models
import { CustomError } from '../../models/custorm-error';
import { CustomJSONSchema } from '../../models/interfaces/ICustomJSONSchema';

export const validateJSONSchema = (jsonSchema: CustomJSONSchema, isHeader: boolean) => (req: Request, res: Response, next: NextFunction) => {

    console.log('Given Schema: ', jsonSchema);
    let valueToCheck = req.body;
    if(isHeader) {
        valueToCheck = {
            x_client_name: req.header('x_client_name'),
            x_client_version: req.header('x_client_version'),
            x_client_type: req.header('x_client_type'),
        }
        console.log('VALIDATON FOR HEADER: ', valueToCheck);
    }
    const ajv = new Ajv({ allErrors: true });
    let validate = ajv.compile(jsonSchema);
    const isValid = validate(valueToCheck);
    console.log(`Schema ${jsonSchema.title} is valid: ${isValid}`);

    if(!isValid) {
        let customValidationErr: CustomError[] = [];
        if(validate.errors) {
            validate.errors.forEach((err: ErrorObject) => {
                const msg = `Given object doesnt match ${ jsonSchema.title } schema, property: ${ err.instancePath }, err: ${ err.message }`;
                customValidationErr.push(new CustomError('SchemaValidationError', msg , 'validateJSONSchema()'));
            });
        }
        res.status(400).json(customValidationErr);
        res.end();
    }
    else {
        next();
    }
}