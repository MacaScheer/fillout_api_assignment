"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const filters_1 = __importDefault(require("./routes/filters"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.get('/', filters_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
