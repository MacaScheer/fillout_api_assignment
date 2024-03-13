"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let filters = [];
router.get('/', (req, res) => {
    // const filter: 
    console.log('REQUEST: ', req);
});
exports.default = router;
