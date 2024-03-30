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