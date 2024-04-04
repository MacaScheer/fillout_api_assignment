import { Router } from 'express';
import { FormData } from '../models/formData';
import {filterResponses, getFilterTypes } from '../util/filterUtil';
import {config} from 'dotenv';

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
        const filterParamValues = (new URLSearchParams(req.url)).values();
        const filterTypes = getFilterTypes(filterParamValues);
        axios
            .request(options)
            .then(function ({ data }: { data: FormData }) {
                let filteredResponses = filterResponses(
                    data,
                    filterTypes,
                );
                if (filteredResponses != null) {
                    res.json({ responses: filteredResponses })
                }
            })
            .catch(function (error: any) {
                console.error(error);
            });
    });
export default router;