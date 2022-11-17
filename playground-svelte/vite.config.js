"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const vite_plugin_svelte_1 = require("@sveltejs/vite-plugin-svelte");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, vite_plugin_svelte_1.svelte)()],
});
