"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterQuestions = void 0;
// import { FilterConditionTypes } from "../models/FilterConditionTypes";
// import { ServerResponse } from "../models/serverResponse";
let testDate = new Date(Date.parse("2024-02-22T05:01:47.691Z"));
testDate.toDateString();
// const filter1: Filter = {
//     id: 'birthdayId',
//     condition: 'greater_than',
//     value: "2024-02-22T05:01:47.691Z",
// }
// const filter2: Filter = {
//     id: 'nameId',
//     condition: 'equals',
//     value: "Timmy",
// }
const filterQuestions = (formInput, filters) => {
    const { responses } = formInput;
    console.log('RESPONSES: ', responses);
    // const serverResponses = {
    //     "responses": []
    // };
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
};
exports.filterQuestions = filterQuestions;
