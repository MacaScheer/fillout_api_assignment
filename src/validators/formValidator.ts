import { validationResult, body } from 'express-validator';

export const validateInput = (req: Request) => {
    console.log('REQ: ', req);

    // const result = validationResult(req);
    // const field = body('categories');

    // console.log('FIELD', field);
    // if (result.isEmpty()) {
    //     return result.throw();
    // }
}
