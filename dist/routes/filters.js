"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filterUtil_1 = require("../util/filterUtil");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const axios = require('axios');
const router = (0, express_1.Router)();
const apiKey = process.env.API_KEY;
const options = {
    method: 'GET',
    url: `https://api.fillout.com/v1/api/forms/${process.env.FILE_ID}/submissions`,
    json: true,
    headers: apiKey,
};
router.get("/", (req, res) => {
    const filterParamValues = (new URLSearchParams(req.url.toString())).values();
    const filterTypes = (0, filterUtil_1.getFilterTypes)(filterParamValues);
    axios
        .request(options)
        .then(function ({ data }) {
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
