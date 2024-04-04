"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionGroupPassesFilters = exports.doAnyOfQuestionIDsMatch = exports.filterResponses = exports.convertStringToDate = exports.getFilterClausesArray = exports.separateFilterCluses = exports.getFilterTypes = exports.getSingleFilterClause = void 0;
const filter_1 = require("../models/filter");
const getSingleFilterClause = (filterString) => {
    return filterString.slice(1, filterString.indexOf('}'));
};
exports.getSingleFilterClause = getSingleFilterClause;
var FILTER_CONDITIONS;
(function (FILTER_CONDITIONS) {
    FILTER_CONDITIONS["EQUALS"] = "equals";
    FILTER_CONDITIONS["DOES_NOT_EQUAL"] = "does_not_equal";
    FILTER_CONDITIONS["GREATER_THAN"] = "greater_than";
    FILTER_CONDITIONS["LESS_THAN"] = "less_than";
})(FILTER_CONDITIONS || (FILTER_CONDITIONS = {}));
var QUESTION_RESPONSE_TYPE;
(function (QUESTION_RESPONSE_TYPE) {
    QUESTION_RESPONSE_TYPE["DATE_STRING"] = "DateString";
    QUESTION_RESPONSE_TYPE["NUMBER_INPUT"] = "NumberInput";
})(QUESTION_RESPONSE_TYPE || (QUESTION_RESPONSE_TYPE = {}));
const getFilterTypes = (paramValues) => {
    const filterTypeArray = new Array();
    const filterStringArray = (0, exports.getFilterClausesArray)(paramValues);
    for (let filterString of filterStringArray) {
        const filter = (0, filter_1.createEmptyFilter)();
        const filterKeyValues = filterString.split(',');
        for (let i = 0; i < 3; i++) {
            const keyValArr = filterKeyValues[i].split(':');
            const filterValue = keyValArr[1].trimStart().trimEnd();
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
const convertStringToDate = (dateString) => {
    return new Date(dateString);
};
exports.convertStringToDate = convertStringToDate;
const filterResponses = (formInput, filters) => {
    let responses = formInput.responses;
    let questionGroups = new Array();
    for (let questionGroup of responses) {
        if ((0, exports.doAnyOfQuestionIDsMatch)(questionGroup, filters) && (0, exports.questionGroupPassesFilters)(questionGroup, filters)) {
            questionGroups.push(questionGroup);
        }
    }
    return questionGroups;
};
exports.filterResponses = filterResponses;
const doAnyOfQuestionIDsMatch = ({ questions }, filters) => {
    for (let question of questions) {
        for (let filter of filters) {
            if (question != null && question.id.toString() === filter.id) {
                return true;
            }
        }
    }
    return false;
};
exports.doAnyOfQuestionIDsMatch = doAnyOfQuestionIDsMatch;
const questionGroupPassesFilters = ({ questions }, filters) => {
    for (let question of questions) {
        for (let filter of filters) {
            if (question != null && question.id.toString() === filter.id) {
                let questionValueString = question.value?.toString() == undefined ? null : question.value?.toString();
                switch (filter.condition) {
                    case FILTER_CONDITIONS.EQUALS:
                        if (question.value == null && filter.value == null) {
                            break;
                        }
                        if (questionValueString != null &&
                            filter.value != null &&
                            ((question.type === QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                (0, exports.convertStringToDate)(questionValueString) !== (0, exports.convertStringToDate)(filter.value.toString())) ||
                                (question.type === QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) !== parseInt(questionValueString, 10)) ||
                                filter.value !== questionValueString)) {
                            return false;
                        }
                        break;
                    case FILTER_CONDITIONS.DOES_NOT_EQUAL:
                        if (questionValueString != null &&
                            filter.value != null &&
                            ((question.type === QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                (0, exports.convertStringToDate)(questionValueString) === (0, exports.convertStringToDate)(filter.value.toString())) ||
                                (question.type === QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) === parseInt(questionValueString, 10)) ||
                                filter.value === questionValueString)) {
                            return false;
                        }
                        break;
                    case FILTER_CONDITIONS.GREATER_THAN:
                        if (questionValueString == null || filter.value == null || question.value == null) {
                            return false;
                        }
                        if ((question.type === QUESTION_RESPONSE_TYPE.DATE_STRING &&
                            (0, exports.convertStringToDate)(filter.value.toString()) >= (0, exports.convertStringToDate)(questionValueString)) ||
                            (question.type === QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) >= parseInt(questionValueString, 10)) ||
                            filter.value >= questionValueString) {
                            return false;
                        }
                        console.log('\nFILTER: ', filter.value, "\nQUESTION: ", questionValueString, "\nFILTER VALUe GREATER OR EQUAL TO QUESTION VALUE: ", filter.value >= questionValueString);
                        break;
                    case FILTER_CONDITIONS.LESS_THAN:
                        if (questionValueString != null &&
                            question.value != null &&
                            filter.value != null &&
                            ((question.type === QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                (0, exports.convertStringToDate)(filter.value.toString()) <= (0, exports.convertStringToDate)(questionValueString)) ||
                                (question.type === QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) <= parseInt(questionValueString, 10)) ||
                                filter.value <= questionValueString)) {
                            return false;
                        }
                        break;
                }
            }
        }
    }
    return true;
};
exports.questionGroupPassesFilters = questionGroupPassesFilters;
