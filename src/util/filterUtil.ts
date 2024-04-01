import { createEmptyFilter, Filter } from "../models/filter";
import { FormData } from "../models/formData";
import { QuestionResponse } from "../models/questionResponse";
import { ServerResponse, createEmptyServerResponse } from "../models/serverResponse";

export const getSingleFilterClause = (filterString: string): string => {
    return filterString.slice(1, filterString.indexOf('}'));
}

enum FILTER_CONDITIONS {
    EQUALS ='equals',
    DOES_NOT_EQUAL = 'does_not_equals',
    GREATER_THAN = 'greater_than',
    LESS_THAN = 'less_than',
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

export const getFilterTypes = (paramValues: IterableIterator<string>) /*: Array<Filter | null>*/ => {
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
                        case 1:
                            filter.condition = filterValue;
                        case 2:
                            filter.value = filterValue;
                    }
        }
        filterTypeArray.push(filter);
    }
    return filterTypeArray;
}

export const filterQuestions = (formInput: FormData, filters:
    Array<Filter>
    ) : (Array<QuestionResponse> | null) => {
    const { responses } = formInput;
    let serverResponse: ServerResponse = createEmptyServerResponse();
        const questions = responses[0].questions;
        for (let question of questions) {
            for (let filter of filters) {
                if (filter.id === question.id) {
                    switch (filter.condition) {
                        case FILTER_CONDITIONS.EQUALS:
                            if (
                                question.type === 'DatePicker' &&
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
                                question.type === 'DatePicker' &&
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
                                question.type === 'DatePicker' &&
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
                                question.type === 'DatePicker' &&
                                question.value !== null &&
                                filter.value !== null &&
                                convertStringToDate(question.value) <= convertStringToDate(filter.value.toString())
                            ) {
                                return null;
                            } else if (filter.value != null && question.value != null && filter.value > question.value) {
                                 return null;
                            }
                    }
                }
            }     
        }
    return questions;
}

export const convertStringToDate = (dateString: string): Date => {
    return new Date(dateString);
}