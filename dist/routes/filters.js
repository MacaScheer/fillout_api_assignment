"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filterUtil_1 = require("../util/filterUtil");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const axios = require('axios');
const router = (0, express_1.Router)();
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
    console.log('FILTER PARAM VALUEs: ', filterParamValues);
    const filterTypes = (0, filterUtil_1.getFilterTypes)(filterParamValues);
    axios
        .request(options)
        .then(function ({ data }) {
        console.log('FILTER TYPEs: ', filterTypes);
        if (filterTypes.length === 0) {
            res.json({ responses: data });
        }
        let filteredResponses = (0, filterUtil_1.filterResponses)(data, filterTypes);
        if (filteredResponses != null) {
            res.json({ responses: filteredResponses });
        }
    })
        .catch(function (error) {
        console.error(error);
    });
});
exports.default = router;
