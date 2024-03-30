import { QuestionResponse } from "./questionResponse"

export type ServerResponse = {
    "responses": [
        {
            "questions": Array<QuestionResponse | null>,

        }
    ],
        "totalResponses": number | null,
    "pageCount": number | null,

    calculations: [],
    urlParameters: [],
    quiz: {},
    documents: [],
}

export const createEmptyServerResponse = (): ServerResponse => {
   return {
        "responses": [
        {
            "questions": [],

        }
    ],
        "totalResponses": null,
        "pageCount": null,

        calculations: [],
        urlParameters: [],
        quiz: {},
        documents: [],
    };
}