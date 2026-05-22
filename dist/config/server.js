"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("@/config"));
const server = (0, express_1.default)();
server.listen(config_1.default.PORT, () => {
    console.log(`server listening @ http://localhost : ${config_1.default.PORT}`);
});
