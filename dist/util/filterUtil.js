"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterQuestions = exports.getFilterTypes = exports.getFilterClausesArray = exports.separateFilterCluses = exports.getSingleFilterClause = void 0;
const filter_1 = require("../models/filter");
const serverResponse_1 = require("../models/serverResponse");
const getSingleFilterClause = (filterString) => {
    return filterString.slice(1, filterString.indexOf('}'));
};
exports.getSingleFilterClause = getSingleFilterClause;
const separateFilterCluses = (paramString) => {
    let filterArr = new Array();
    let i = 0;
    while (i < paramString.length - 1) {
        let char = paramString[i];
        if (char === '{') {
            let filterString = (0, exports.getSingleFilterClause)(paramString.slice(i, paramString.length));
            filterArr.push(filterString);
            i += filterString.length;
        }
        else {
            i++;
        }
    }
    return filterArr;
};
exports.separateFilterCluses = separateFilterCluses;
const getFilterClausesArray = (paramValues) => {
    let filterClauses = new Array();
    for (let value of paramValues) {
        for (let clause of (0, exports.separateFilterCluses)(value)) {
            filterClauses.push(clause);
        }
    }
    return filterClauses;
};
exports.getFilterClausesArray = getFilterClausesArray;
const getFilterTypes = (paramValues) => {
    const filterTypeArray = new Array();
    const filterStringArray = (0, exports.getFilterClausesArray)(paramValues);
    for (let filterString of filterStringArray) {
        const filter = (0, filter_1.createEmptyFilter)();
        const filterKeyValues = filterString.split(',');
        for (let i = 0; i < 3; i++) {
            const keyValArr = filterKeyValues[i].split(':');
            const filterValue = keyValArr[1];
            switch (i) {
                case 0:
                    filter.id = filterValue;
                case 1:
                    filter.condition = filterValue;
                case 2:
                    filter.value = filterValue;
            }
        }
        filterTypeArray.push(filter);
    }
    return filterTypeArray;
};
exports.getFilterTypes = getFilterTypes;
const filterQuestions = (formInput, filters) => {
    console.log('FILTER ARRAY: ', filters);
    const { responses } = formInput;
    let serverResponse = (0, serverResponse_1.createEmptyServerResponse)();
    // const questions = responses.questions;z
    for (let response of responses) {
        const questions = response.questions;
        for (let question of questions) {
            console.log('QUESTION: ', question);
        }
    }
    // for (let question of questions) {
    // let questionId = question.id;
    // console.log('QUESTION: ', question.id, question.name, question.type, question.options);
    //     switch (condition) {
    //         case 'greater_than':
    //         case 'less_than':
    //         case 'equals':
    //         case 'does_not_equal':
    // }
    // }
};
exports.filterQuestions = filterQuestions;
