"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStringToDate = exports.filterQuestions = exports.filterResponses = exports.getFilterTypes = exports.getFilterClausesArray = exports.separateFilterCluses = exports.getSingleFilterClause = void 0;
const filter_1 = require("../models/filter");
const getSingleFilterClause = (filterString) => {
    return filterString.slice(1, filterString.indexOf('}'));
};
exports.getSingleFilterClause = getSingleFilterClause;
var FILTER_CONDITIONS;
(function (FILTER_CONDITIONS) {
    FILTER_CONDITIONS["EQUALS"] = "equals";
    FILTER_CONDITIONS["DOES_NOT_EQUAL"] = "does_not_equals";
    FILTER_CONDITIONS["GREATER_THAN"] = "greater_than";
    FILTER_CONDITIONS["LESS_THAN"] = "less_than";
})(FILTER_CONDITIONS || (FILTER_CONDITIONS = {}));
var CONDITION_TYPE;
(function (CONDITION_TYPE) {
    CONDITION_TYPE["DATE_STRING"] = "DateString";
    /* NOT USED */
    CONDITION_TYPE["MULTIPLE_CHOICE"] = "MultipleChoice";
    CONDITION_TYPE["EMAIL_INPUT"] = "EmailInput";
    CONDITION_TYPE["SHORT_ANSWER"] = "ShortAnswer";
    CONDITION_TYPE["NUMBER_INPUT"] = "NumberInput";
    CONDITION_TYPE["LONG_ANSWER"] = "LongAnswer";
})(CONDITION_TYPE || (CONDITION_TYPE = {}));
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
                    break;
                case 1:
                    filter.condition = filterValue;
                    break;
                case 2:
                    filter.value = filterValue;
            }
        }
        filterTypeArray.push(filter);
    }
    return filterTypeArray;
};
exports.getFilterTypes = getFilterTypes;
const filterResponses = (formInput, filters) => {
    let questionGroups = new Array();
    for (let questionGroup of formInput.responses) {
        questionGroups.push((0, exports.filterQuestions)(questionGroup, filters));
    }
    return questionGroups;
};
exports.filterResponses = filterResponses;
const filterQuestions = (questionGroup, filters) => {
    const questions = questionGroup.questions;
    for (let filter of filters) {
        for (let question of questions) {
            console.log('QUESTION: ', question);
            // console.log('FILTER VALUE: ', filter.value, ' QUESTION VALUE: ', question.value);
            if (filter.id === question.id) {
                switch (filter.condition) {
                    case FILTER_CONDITIONS.EQUALS:
                        if (question.type === CONDITION_TYPE.DATE_STRING &&
                            question.value !== null &&
                            filter.value !== null &&
                            (0, exports.convertStringToDate)(question.value) !== (0, exports.convertStringToDate)(filter.value.toString())) {
                            return null;
                        }
                        else if (filter.value !== question.value) {
                            return null;
                        }
                    case FILTER_CONDITIONS.DOES_NOT_EQUAL:
                        if (question.type === CONDITION_TYPE.DATE_STRING &&
                            question.value !== null &&
                            filter.value !== null &&
                            (0, exports.convertStringToDate)(question.value) === (0, exports.convertStringToDate)(filter.value.toString())) {
                            return null;
                        }
                        else if (filter.value === question.value) {
                            return null;
                        }
                    case FILTER_CONDITIONS.GREATER_THAN:
                        console.log('GREATER THAN', filter.condition);
                        if (question.type === CONDITION_TYPE.DATE_STRING &&
                            question.value !== null &&
                            filter.value !== null &&
                            (0, exports.convertStringToDate)(question.value) >= (0, exports.convertStringToDate)(filter.value.toString())) {
                            console.log('WILL RETURN NULL');
                            return null;
                        }
                        else if (filter.value != null && question.value != null && filter.value < question.value) {
                            return null;
                        }
                    case FILTER_CONDITIONS.LESS_THAN:
                        if (question.type === CONDITION_TYPE.DATE_STRING &&
                            question.value !== null &&
                            filter.value !== null &&
                            (0, exports.convertStringToDate)(question.value) <= (0, exports.convertStringToDate)(filter.value.toString())) {
                            return null;
                        }
                        else if (filter.value != null && question.value != null && filter.value > question.value) {
                            return null;
                        }
                }
            }
            else
                return null;
        }
    }
    return questions;
};
exports.filterQuestions = filterQuestions;
const convertStringToDate = (dateString) => {
    return new Date(dateString);
};
exports.convertStringToDate = convertStringToDate;
