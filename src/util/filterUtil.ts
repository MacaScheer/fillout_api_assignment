import { createEmptyFilter, Filter } from "../models/filter";
import { FormData } from "../models/formData";
import { QuestionResponse } from "../models/questionResponse";
import { ResponseData } from "../models/responseData";

export const getSingleFilterClause = (filterString: string): string => {
    return filterString.slice(1, filterString.indexOf('}'));
}

enum FILTER_CONDITIONS {
    EQUALS ='equals',
    DOES_NOT_EQUAL = 'does_not_equals',
    GREATER_THAN = 'greater_than',
    LESS_THAN = 'less_than',
}

enum CONDITION_TYPE {
    DATE_STRING = 'DateString',
    /* NOT USED */
    MULTIPLE_CHOICE = 'MultipleChoice',
    EMAIL_INPUT = 'EmailInput',
    SHORT_ANSWER = 'ShortAnswer',
    NUMBER_INPUT = 'NumberInput',
    LONG_ANSWER = 'LongAnswer',
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

export const getFilterTypes = (paramValues: IterableIterator<string>) => {
    const filterTypeArray = new Array();
    const filterStringArray = getFilterClausesArray(paramValues);
    for (let filterString of filterStringArray) {
        const filter = createEmptyFilter();
        const filterKeyValues = filterString.split(',');
        for (let i = 0; i < 3; i++) {
            const keyValArr = filterKeyValues[i].split(':');
            const filterValue = keyValArr[1] as string;
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

export const filterResponses = (formInput: FormData, filters:
    Array<Filter>
): (Array<QuestionResponse | null>) => { 
    let questionGroups = new Array();
    for (let questionGroup of formInput.responses) {
        questionGroups.push(filterQuestions(questionGroup, filters));
    }
    return questionGroups;
}

/*
LOGIC: 
    ITERATE THRU FILTERS:
        FILTER:
        ID MATCHES?
            YES? ID/CONDITION/VALUE
             ITERATE THRU QUESTIONS:
                QUESTION:
                    ID MATCHES?
                        DOES VALUE + CONDITION MATCH?
                            NO? RETURN NULL => NO QUESTIONS FROM GROUP
                            YES? KEEP ITERATING, AT END, RETURN ALL QUESTIONS??????
            NO? KEEP ITERATING
*/

export const filterQuestions = (questionGroup: ResponseData, filters:
    Array<Filter>
): (Array<QuestionResponse> | null) => {
    const questions = questionGroup.questions;
    for (let filter of filters) {
        for (let question of questions) {
            if (filter.id === question.id) {
                switch (filter.condition) {
                    case FILTER_CONDITIONS.EQUALS:
                        if (
                            question.type === CONDITION_TYPE.DATE_STRING &&
                            question.value !== null &&
                            filter.value !== null &&
                            convertStringToDate(question.value) !== convertStringToDate(filter.value.toString())
                        ) {
                            return null;
                        } else if (filter.value !== question.value) {
                            return null;
                        }
                    case FILTER_CONDITIONS.DOES_NOT_EQUAL:
                        if (
                            question.type === CONDITION_TYPE.DATE_STRING &&
                            question.value !== null &&
                            filter.value !== null &&
                            convertStringToDate(question.value) === convertStringToDate(filter.value.toString())
                        ) {
                            return null;
                        } else if (filter.value === question.value) {
                            return null;
                        }
                    case FILTER_CONDITIONS.GREATER_THAN:
                        if (
                            question.type === CONDITION_TYPE.DATE_STRING &&
                            question.value !== null &&
                            filter.value !== null &&
                            convertStringToDate(question.value) >= convertStringToDate(filter.value.toString())
                        ) {
                            return null;
                        } else if (filter.value != null && question.value != null && filter.value < question.value) {
                            return null;
                        }
                    case FILTER_CONDITIONS.LESS_THAN:
                        if (
                            question.type === CONDITION_TYPE.DATE_STRING &&
                            question.value !== null &&
                            filter.value !== null &&
                            convertStringToDate(question.value) <= convertStringToDate(filter.value.toString())
                        ) {
                            return null;
                        } else if (filter.value != null && question.value != null && filter.value > question.value) {
                            return null;
                        }
                }
            } else return null;
            }     
        }
    return questions;
}

export const convertStringToDate = (dateString: string): Date => {
    return new Date(dateString);
}