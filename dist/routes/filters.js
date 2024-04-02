"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filterUtil_1 = require("../util/filterUtil");
const axios = require('axios');
const router = (0, express_1.Router)();
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
    const filterTypes = (0, filterUtil_1.getFilterTypes)(filterParamValues);
    axios
        .request(options)
        .then(function ({ data }) {
        const filteredResponses = (0, filterUtil_1.filterResponses)(data, filterTypes);
        if (filteredResponses != null) {
            res.json({ responses: filteredResponses });
        }
    })
        .catch(function (error) {
        console.error(error);
    });
});
exports.default = router;
