"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = require("dotenv");
const URLFormFilter_1 = require("../util/URLFormFilter");
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
    axios
        .request(options)
        .then(function ({ data }) {
        const urlFormFilter = new URLFormFilter_1.URLFormFilter(req.url, data);
        const filterTypes = urlFormFilter.getFilterTypes();
        if (filterTypes.length === 0) {
            res.json({ responses: data });
        }
        const filteredResponses = urlFormFilter.filterResponses(filterTypes);
        if (filteredResponses != null) {
            res.json({ responses: filteredResponses });
        }
    })
        .catch(function (error) {
        console.error(error);
    });
});
exports.default = router;
