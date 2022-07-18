"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_svelte_1 = __importDefault(require("./App.svelte"));
const app = new App_svelte_1.default({
    target: document.getElementById("app"),
});
exports.default = app;
