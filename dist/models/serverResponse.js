"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyServerResponse = void 0;
const createEmptyServerResponse = () => {
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
};
exports.createEmptyServerResponse = createEmptyServerResponse;
