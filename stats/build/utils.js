"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateString2Date = void 0;
const dateString2Date = (dateString) => {
    // 28/10/2018
    const dateParts = dateString.split("/").map((value) => {
        return parseInt(value);
    });
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
};
exports.dateString2Date = dateString2Date;
