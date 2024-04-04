import { createEmptyFilter, Filter } from "../models/filter";
import { FormData } from "../models/formData";
import { QuestionResponse } from "../models/questionResponse";
import { ResponseData } from "../models/responseData";

export const getSingleFilterClause = (filterString: string): string => {
    return filterString.slice(1, filterString.indexOf('}'));
}

enum FILTER_CONDITIONS {
    EQUALS ='equals',
    DOES_NOT_EQUAL = 'does_not_equal',
    GREATER_THAN = 'greater_than',
    LESS_THAN = 'less_than',
}

enum QUESTION_RESPONSE_TYPE {
    DATE_STRING = 'DateString',
    NUMBER_INPUT = 'NumberInput',
}

export const getFilterTypes = (paramValues: IterableIterator<string>) => {
    const filterTypeArray = new Array();
    const filterStringArray = getFilterClausesArray(paramValues);
    for (let filterString of filterStringArray) {
        const filter = createEmptyFilter();
        const filterKeyValues = filterString.split(',');
        for (let i = 0; i < 3; i++) {
            const keyValArr = filterKeyValues[i].split(':');
            const filterValue = (keyValArr[1] as string).trimStart().trimEnd();
                switch (i) {
                    case 0:
                        filter.id = filterValue as string;
                        break;
                    case 1:
                        filter.condition = filterValue as string;
                        break;
                        case 2:
                            filter.value = filterValue;
                    }
        }
        filterTypeArray.push(filter);
    }
    return filterTypeArray;
}

export const separateFilterCluses = (paramString: string): Array<string | null> => {
    let filterArr = new Array();
    let i = 0;
    while (i < paramString.length - 1) {
        let char = paramString[i];
        if (char === '{') {
            let filterString = getSingleFilterClause(paramString.slice(i, paramString.length));
            filterArr.push(filterString);
            i += filterString.length;
        }
        else {
            i++;
        }
    }
    return filterArr;
}

export const getFilterClausesArray = (paramValues: IterableIterator<string>) => {
    let filterClauses = new Array()
    for (let value of paramValues) {
        for (let clause of separateFilterCluses(value)) {
            filterClauses.push(clause);
        }
    }
    return filterClauses;
}


export const convertStringToDate = (dateString: string): Date => {
    return new Date(dateString);
}

export const filterResponses = (formInput: FormData, filters:
    Array<Filter>
): (Array<QuestionResponse | null>) => { 
    let responses = formInput.responses;
    let questionGroups = new Array();
    for (let questionGroup of responses) {
        if (doAnyOfQuestionIDsMatch(questionGroup, filters) && questionGroupPassesFilters(questionGroup, filters)) {
            questionGroups.push(questionGroup);
        }
    }
    return questionGroups;
}

export const doAnyOfQuestionIDsMatch = ({ questions }: ResponseData, filters: Array<Filter>): Boolean => {
    for (let question of questions) {
        for (let filter of filters) {
            if (question != null && question.id.toString() === filter.id) {
                return true;
            }
        }
    }
    return false;
}

export const questionGroupPassesFilters = ({ questions }: ResponseData, filters: Array<Filter>): Boolean => {
    for (let question of questions) {
        for (let filter of filters) {
            if (question != null && question.id.toString() === filter.id) {
                let questionValueString = question.value?.toString() == undefined ? null: question.value?.toString();
                    switch (filter.condition) {
                        case FILTER_CONDITIONS.EQUALS:
                            if (question.value == null && filter.value == null) {
                                break;
                            }
                            if (
                                questionValueString != null &&
                                filter.value != null &&
                                (
                                    (question.type === QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                        convertStringToDate(questionValueString) !== convertStringToDate(filter.value.toString())
                                    ) ||
                                (question.type === QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) !== parseInt(questionValueString, 10)) ||
                                    filter.value !== questionValueString
                                )
                            ) {
                                return false;
                            }
                            break;    
                        case FILTER_CONDITIONS.DOES_NOT_EQUAL:
                            if (
                                questionValueString != null &&
                                filter.value != null &&
                                (
                                    (question.type === QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                        convertStringToDate(questionValueString) === convertStringToDate(filter.value.toString())
                                    ) ||
                                (question.type === QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) === parseInt(questionValueString, 10)) ||
                                    filter.value === questionValueString
                                )
                            ) {
                                return false;
                            }
                            break;
                        case FILTER_CONDITIONS.GREATER_THAN:
                            if (questionValueString == null || filter.value == null || question.value == null) {
                                return false;
                            }
                            if (
                               
                                    (question.type === QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                       convertStringToDate(filter.value.toString()) >= convertStringToDate(questionValueString)
                                    ) ||
                                (question.type === QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) >= parseInt(questionValueString, 10)) ||
                                    filter.value >= questionValueString
                                
                            ) {
                                return false;
                            }
                            break;
                        case FILTER_CONDITIONS.LESS_THAN:
                            if (
                                questionValueString != null &&
                                question.value != null &&
                                filter.value != null &&
                                (
                                    (question.type === QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                       convertStringToDate(filter.value.toString()) <= convertStringToDate(questionValueString)
                                    ) ||
                                (question.type === QUESTION_RESPONSE_TYPE.NUMBER_INPUT && parseInt(filter.value, 10) <= parseInt(questionValueString, 10)) ||
                                    filter.value <= questionValueString
                                )
                            ) {
                                return false;
                            }
                            break;
                    }
                }
            }
        }
    return true;
}