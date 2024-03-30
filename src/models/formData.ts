import { QuestionResponse } from "./questionResponse"

export type FormData = {
    "responses": [
        {
            "submissionId": string,
            "submissionTime": string,
            'lastUpdatedAt': string,
            "questions":Array<QuestionResponse>,
        },
    ],
    "totalResponses": number,
    "pageCount": number,

    calculations: [],
    urlParameters: [],
    quiz: {},
    documents: []
}

export const createEmptyFormData = (): FormData => {
    return {
        "responses": [
            {
                "submissionId": '',
                "submissionTime": '',
                'lastUpdatedAt': '',
                "questions": [],
            },
        ],
        "totalResponses": 0,
        "pageCount": 0,
        calculations: [],
        urlParameters: [],
        quiz: {},
        documents: [],
    };
}