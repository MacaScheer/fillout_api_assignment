import { Router } from 'express';
import { FormData } from '../models/formData';
import {config} from 'dotenv';
import { URLFormFilter } from '../util/URLFormFilter';

config();
const axios = require('axios');
const router = Router();
const apiKey = process.env.API_KEY;
const options = {
    method: 'GET',
    url: `https://api.fillout.com/v1/api/forms/${process.env.FILE_ID}/submissions`,
    json: true,
    headers: {
        'Authorization': apiKey,
    }
};
router.get("/", (req, res) => {
    axios
    .request(options)
    .then(function ({ data }: { data: FormData }) {
        const urlFormFilter = new URLFormFilter(req.url, data);
        const filterTypes = urlFormFilter.getFilterTypes();
        if (filterTypes.length === 0) {
            res.json({responses: data});
        }
        const filteredResponses = urlFormFilter.filterResponses(filterTypes);
        if (filteredResponses != null) {
                    res.json({ responses: filteredResponses })
                }
            })
            .catch(function (error: any) {
                console.error(error);
            });
    });

export default router;