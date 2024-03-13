import { Router, Request, Response } from 'express';
import { Filter } from '../models/filter';

const router = Router();
let filters: Filter[] = [];

router.get('/', (req: Request, res: Response) => {
    // const filter: 
    console.log('REQUEST: ', req);
})
export default router;