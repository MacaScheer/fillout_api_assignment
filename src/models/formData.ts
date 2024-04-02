import { QuestionResponse } from "./questionResponse"
import { ResponseData } from "./responseData";

export type FormData = {
    "responses": [
        ResponseData,
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