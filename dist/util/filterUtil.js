"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStringToDate = exports.filterQuestions = exports.findQuestionID = exports.filterResponses = exports.getFilterTypes = exports.getFilterClausesArray = exports.separateFilterCluses = exports.getSingleFilterClause = void 0;
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
/*
LOGIC:
    ITERATE THRU FILTERS:
        FILTER: ID MATCHES?
            YES? ID/CONDITION/VALUE
             ITERATE THRU QUESTIONS:
                QUESTION:
                    ID MATCHES?
                        DOES VALUE + CONDITION MATCH?
                            NO? RETURN NULL => NO QUESTIONS FROM GROUP
                            YES? KEEP ITERATING, AT END, RETURN ALL QUESTIONS??????
            NO? KEEP ITERATING

            WHAT TO RETURN IF NO ID MATCHES? NOTHING
*/
// VALIDATE INPUTS HAVE NO QUOTES
// export const areQuotesInStrings = (filterVal: string | null): Boolean => {
//     if (filterVal == null) {
//         return false;
//     }
//    return (filterVal.toString()[0] === "'" || filterVal.toString()[0] === '"') &&
//         (filterVal.toString()[filterVal.toString().length - 1] === "'" ||
//             filterVal[filterVal.length - 1] === '"')
// }
// export const trimQuotesInFilter = (filter: Filter): {id: string, condition: string, value: string} => {
//     const trimmedFilter = {
//         id: '',
//         condition: '',
//         value: '',
//     };
//     if (areQuotesInStrings(filter.id) && filter.id !== null) {    
//         trimmedFilter.id = filter?.id?.toString().slice(1, filter.id.length - 1);
//     }
//     if (areQuotesInStrings(filter.condition) && filter.condition !== null) {
//         trimmedFilter.condition = filter.condition.toString().slice(1, filter.condition.length - 1);
//     }
//     if (filter.value && areQuotesInStrings(filter.value?.toString()) && filter.value !== null) {
//         trimmedFilter.value = filter.value.toString().slice(1, filter.value.length - 1);
//     }
// }
const findQuestionID = ({ questions }, filterID) => {
    const filteredQuestions = questions.filter(question => {
        console.log('QUESTION.id', question.id, ' FILTER ID: ', filterID, ' EQUALS: ', question.id.toString() === filterID);
        return question.id.toString() === filterID;
    });
    if (filteredQuestions.length > 0) {
        return filteredQuestions;
    }
};
exports.findQuestionID = findQuestionID;
const filterQuestions = (questionGroup, filters) => {
    let returnQuestions = new Array();
    for (let filter of filters) {
        if (filter.id != null) {
            const matchingIDQuestions = (0, exports.findQuestionID)(questionGroup, filter.id);
            if (matchingIDQuestions != undefined) {
                returnQuestions.push(...matchingIDQuestions.map(question => {
                    if (question != null && filter.id === question.id) {
                        switch (filter.condition) {
                            case FILTER_CONDITIONS.EQUALS:
                                if (question.type === CONDITION_TYPE.DATE_STRING &&
                                    question.value !== null &&
                                    filter.value !== null &&
                                    (0, exports.convertStringToDate)(question.value) === (0, exports.convertStringToDate)(filter.value.toString())) {
                                    return question;
                                }
                                else if (filter.value === question.value) {
                                    console.log('FILTER.VALUE: ', filter.value, ' QUESTION.VALUE: ', question.value);
                                    return question;
                                }
                                break;
                            case FILTER_CONDITIONS.DOES_NOT_EQUAL:
                                if (question.type === CONDITION_TYPE.DATE_STRING &&
                                    question.value !== null &&
                                    filter.value !== null &&
                                    (0, exports.convertStringToDate)(question.value) !== (0, exports.convertStringToDate)(filter.value.toString())) {
                                    return question;
                                }
                                else if (filter.value !== question.value) {
                                    return question;
                                }
                                break;
                            case FILTER_CONDITIONS.GREATER_THAN:
                                if (question.type === CONDITION_TYPE.DATE_STRING &&
                                    question.value !== null &&
                                    filter.value !== null &&
                                    (0, exports.convertStringToDate)(question.value) < (0, exports.convertStringToDate)(filter.value.toString())) {
                                    return question;
                                }
                                else if (filter.value != null && question.value != null && filter.value > question.value) {
                                    return question;
                                }
                                break;
                            case FILTER_CONDITIONS.LESS_THAN:
                                if (question.type === CONDITION_TYPE.DATE_STRING &&
                                    question.value !== null &&
                                    filter.value !== null &&
                                    (0, exports.convertStringToDate)(question.value) > (0, exports.convertStringToDate)(filter.value.toString())) {
                                    return question;
                                }
                                else if (filter.value != null && question.value != null && filter.value < question.value) {
                                    return question;
                                }
                        }
                    }
                }));
                console.log('returnQuestions: ', returnQuestions);
            }
            // .filter(val => val != undefined && val.length !== 0);
        }
    }
    return returnQuestions.filter(el => el != undefined);
};
exports.filterQuestions = filterQuestions;
const convertStringToDate = (dateString) => {
    return new Date(dateString);
};
exports.convertStringToDate = convertStringToDate;
