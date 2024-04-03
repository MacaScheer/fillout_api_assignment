import { Router } from 'express';
import { FormData } from '../models/formData';
import { filterResponses, getFilterTypes } from '../util/filterUtil';
const axios = require('axios');
const router = Router();
const options = {
    method: 'GET',
    url: 'https://api.fillout.com/v1/api/forms/cLZojxk94ous/submissions',
    json: true,
    headers: {
        'Authorization': 'Bearer sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912',
    },
};

    router.get("/", (req, res) => {
        const filterParamValues = (new URLSearchParams(req.url.toString())).values();
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