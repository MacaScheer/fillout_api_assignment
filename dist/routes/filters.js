"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filterUtil_1 = require("../util/filterUtil");
// import { parse } from 'url';
// import { URLJSONEncode } from '../util/filterEncodingUtil';
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
        const filteredResponses = (0, filterUtil_1.filterQuestions)(data, filterTypes);
        return res;
    })
        .catch(function (error) {
        console.error(error);
    });
});
exports.default = router;
// console.log('REQ QUERY', query);
// console.log('URL: ', req.url);
// const filterArray = query.filters;// as Array<Filter>;
// console.log('FILTER ARRAY: ', filterArray);
// const { id, condition, value } = query;
// const idString = id?.toString();
// const conditionString = condition?.toString();
// const valueString = value?.toString();
// console.log('req.url', req.url); 
// console.log('VALS: ', filterParams);
// console.log('FILTER PARAMS: ', filterParams);
// const entries = Object.entries(req.query);
// const parsedURL = JSON.parse(req.url);
// console.log('PARSED URL: ', parsedURL);
// const values = Object.values(req.query)[0] as Array<string>;
// const url = new URL(req.url);
// const params = url.searchParams;
// console.log('PARAMS: ', params);
// for (let value of values) {
// console.log('VALUE: ', value.toString());
// }
// console.log('ENTRIES: ', entries);
// const filterJSON = [
//     {
//         id: "nameId",
//         condition: "equals",
//         value: "Timmy",
//     },
//     {
//         id: "birthdayId",
//         condition: "greater_than",
//         value: "2024-02-23T05:01:47.691Z"
//     }
// ];
// console.log('stringifiedJSON: ', stringifiedJSON);
// console.log('StringifiedJSON: ', stringifiedJSON);
// JSON.parse(req.url.toString(), (key, value) => {
//     console.log('KEY: ', key, ' VALUE: ', value);
// })
// const json = JSON.parse(req.url, (key, value) => {
//     console.log('PARSE KEY: ', key, ' PARSE VALUE: ', value);
// })
// for (let param of filterParams) {
//     for (let i = 0; i < 3; i++){
//         const paramEntries = param.split(',');
//         for (let j = 0; j < 3; j++) {
//             const paramVal = paramEntries[j].split(':')[1];
//             // console.log('PARAM VALS: ', paramVal);
//         }
//     }
// }
// const entries = filterParams.entries();
// const filterValues = filterParams.values();
// let filters = [];
// for (let filter of filterValues) {
//     filters.push(filter.split(', '));
// }
