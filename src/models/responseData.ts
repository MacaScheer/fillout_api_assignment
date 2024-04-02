import { QuestionResponse } from "./questionResponse"

export type ResponseData = {
    "submissionId": string,
    "submissionTime": string,
    'lastUpdatedAt': string,
    "questions": Array<QuestionResponse>,
};