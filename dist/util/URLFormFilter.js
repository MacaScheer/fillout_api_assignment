"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLFormFilter = void 0;
const filter_1 = require("../models/filter");
const enums_1 = require("../enums/enums");
class URLFormFilter {
    constructor(url, data) {
        this.questionGroupPassesFilters = ({ questions }, filters) => {
            for (let question of questions) {
                for (let filter of filters) {
                    if (question != null && question.id.toString() === filter.id) {
                        let questionValueString = question.value?.toString() == undefined ? null : question.value?.toString();
                        switch (filter.condition) {
                            case enums_1.FILTER_CONDITIONS.EQUALS:
                                if (question.value == null || filter.value == null) {
                                    return false;
                                }
                                if (questionValueString != null &&
                                    filter.value != null &&
                                    ((question.type === enums_1.QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                        this.convertStringToDate(questionValueString) !== this.convertStringToDate(filter.value.toString())) ||
                                        (question.type === enums_1.QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) !== parseInt(questionValueString, 10)) ||
                                        filter.value !== questionValueString)) {
                                    return false;
                                }
                                break;
                            case enums_1.FILTER_CONDITIONS.DOES_NOT_EQUAL:
                                if (questionValueString != null &&
                                    filter.value != null &&
                                    ((question.type === enums_1.QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                        this.convertStringToDate(questionValueString) === this.convertStringToDate(filter.value.toString())) ||
                                        (question.type === enums_1.QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) === parseInt(questionValueString, 10)) ||
                                        filter.value === questionValueString)) {
                                    return false;
                                }
                                break;
                            case enums_1.FILTER_CONDITIONS.GREATER_THAN:
                                if (questionValueString == null || filter.value == null || question.value == null) {
                                    return false;
                                }
                                if ((question.type === enums_1.QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                    this.convertStringToDate(filter.value.toString()) >= this.convertStringToDate(questionValueString)) ||
                                    (question.type === enums_1.QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) >= parseInt(questionValueString, 10)) ||
                                    filter.value >= questionValueString) {
                                    return false;
                                }
                                break;
                            case enums_1.FILTER_CONDITIONS.LESS_THAN:
                                if (questionValueString != null &&
                                    question.value != null &&
                                    filter.value != null &&
                                    ((question.type === enums_1.QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                        this.convertStringToDate(filter.value.toString()) <= this.convertStringToDate(questionValueString)) ||
                                        (question.type === enums_1.QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) <= parseInt(questionValueString, 10)) ||
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
        this.data = data;
        this.filterParamValues = (new URLSearchParams(url)).values();
    }
    getFilterTypes() {
        const filterTypeArray = new Array();
        const filterStringArray = this.getFilterClausesArray(this.filterParamValues);
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
    }
    getFilterClausesArray(paramValues) {
        let filterClauses = new Array();
        for (let value of paramValues) {
            for (let clause of this.separateFilterCluses(value)) {
                filterClauses.push(clause);
            }
        }
        return filterClauses;
    }
    separateFilterCluses(paramString) {
        let filterArr = new Array();
        let i = 0;
        while (i < paramString.length - 1) {
            let char = paramString[i];
            if (char === '{') {
                let filterString = this.getSingleFilterClause(paramString.slice(i, paramString.length));
                filterArr.push(filterString);
                i += filterString.length;
            }
            else {
                i++;
            }
        }
        return filterArr;
    }
    getSingleFilterClause(filterString) {
        return filterString.slice(1, filterString.indexOf('}'));
    }
    convertStringToDate(dateString) {
        return new Date(dateString);
    }
    filterResponses(filters) {
        let responses = this.data.responses;
        let questionGroups = new Array();
        for (let questionGroup of responses) {
            if (this.doAnyOfQuestionIDsMatch(questionGroup, filters) && this.questionGroupPassesFilters(questionGroup, filters)) {
                questionGroups.push(questionGroup);
            }
        }
        return questionGroups;
    }
    doAnyOfQuestionIDsMatch({ questions }, filters) {
        for (let question of questions) {
            for (let filter of filters) {
                if (question != null && question.id.toString() === filter.id) {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.URLFormFilter = URLFormFilter;
