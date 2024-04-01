"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyFormData = void 0;
const createEmptyFormData = () => {
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
};
exports.createEmptyFormData = createEmptyFormData;
