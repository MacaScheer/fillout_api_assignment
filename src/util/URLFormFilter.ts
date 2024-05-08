import { createEmptyFilter, Filter } from "../models/filter";
import { FormData } from "../models/formData";
import { FILTER_CONDITIONS, QUESTION_RESPONSE_TYPE } from "../enums/enums";
import { QuestionResponse } from "../models/questionResponse";
import { ResponseData } from "../models/responseData";

export class URLFormFilter {
    data: FormData;
    filterParamValues: IterableIterator<string>;
    
    constructor(url: string, data:
        FormData) {
        this.data = data;
        this.filterParamValues = (new URLSearchParams(url)).values();
    }

    getFilterTypes() {
        const filterTypeArray = new Array();
        const filterStringArray = this.getFilterClausesArray(this.filterParamValues);
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

    getFilterClausesArray(paramValues: IterableIterator<string>) {
        let filterClauses = new Array()
        for (let value of paramValues) {
            for (let clause of this.separateFilterCluses(value)) {
                filterClauses.push(clause);
            }
        }
        return filterClauses;
    }

    separateFilterCluses(paramString: string): Array<string | null> {
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

    getSingleFilterClause(filterString: string): string {
        return filterString.slice(1, filterString.indexOf('}'));
    }

    convertStringToDate (dateString: string): Date {
        return new Date(dateString);
    }

    filterResponses (filters: Array<Filter>): (Array<QuestionResponse | null>) { 
        let responses = this.data.responses;
        let questionGroups = new Array();
        for (let questionGroup of responses) {
            if (this.doAnyOfQuestionIDsMatch(questionGroup, filters) && this.questionGroupPassesFilters(questionGroup, filters)) {
                questionGroups.push(questionGroup);
            }
        }
        return questionGroups;
    }

    doAnyOfQuestionIDsMatch({ questions }: ResponseData, filters: Array<Filter>): Boolean {
        for (let question of questions) {
            for (let filter of filters) {
                if (question != null && question.id.toString() === filter.id) {
                    return true;
                }
            }
        }
        return false;
    }

    questionGroupPassesFilters = ({ questions }: ResponseData, filters: Array<Filter>): Boolean => {
        for (let question of questions) {
            for (let filter of filters) {
                if (question != null && question.id.toString() === filter.id) {
                    let questionValueString = question.value?.toString() == undefined ? null: question.value?.toString();
                        switch (filter.condition) {
                            case FILTER_CONDITIONS.EQUALS:
                                if (question.value == null || filter.value == null) {
                                    return false;
                                }
                                if (
                                    questionValueString != null &&
                                    filter.value != null &&
                                    (
                                        (question.type === QUESTION_RESPONSE_TYPE.DATE_STRING &&
                                            this.convertStringToDate(questionValueString) !== this.convertStringToDate(filter.value.toString())
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
                                            this.convertStringToDate(questionValueString) === this.convertStringToDate(filter.value.toString())
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
                                        this.convertStringToDate(filter.value.toString()) >= this.convertStringToDate(questionValueString)
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
                                        this.convertStringToDate(filter.value.toString()) <= this.convertStringToDate(questionValueString)
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
}