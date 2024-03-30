import { createEmptyFilter, Filter } from "../models/filter";
import { FormData } from "../models/formData";
// import { FilterConditionTypes } from "../models/FilterConditionTypes";
import { ServerResponse, createEmptyServerResponse } from "../models/serverResponse";

// let testDate = new Date(Date.parse("2024-02-22T05:01:47.691Z"));
// testDate.toDateString();

export const getFilterObjects = (paramValues: IterableIterator<string>) => {
    const filterArray = new Array();
    for (let value of paramValues) {
        const paramArrKeyVal = value.split(',');
        let filterObject: Filter = createEmptyFilter();
        for (let i = 0; i < 3; i ++) {
            const keyValArr = paramArrKeyVal[i].split(':');
            const filterValue = keyValArr[1] as string;
            switch (i) {
                case 0:
                    filterObject.id = filterValue;
                case 1:
                    filterObject.condition = filterValue;
                case 2:
                    filterObject.value = filterValue;
            }
            
        }
        filterArray.push(filterObject);
    }
    return filterArray;
}

export const filterQuestions = (formInput: FormData, filters:
    Array<Filter>
    ) => {
    console.log('FILTER ARRAY: ', filters);
    const { responses } = formInput;
    console.log('RESPONSES: ', responses);
    const serverResponse: ServerResponse = createEmptyServerResponse();

    // const conditions = filters.map(f => f.condition);
    // console.log('FILTER CONDITIONS: ', conditions);
    // filters.forEach(f => {
    //     console.log('FILRER CHANGED: ', f);
    // });
    // for (let f in filters) {
    //     console.log('F: ', filters[f], 'FILTErS: ', filters);
    // }
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
}