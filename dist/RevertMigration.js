"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
class RevertMigration {
    inputDir;
    constructor(inputDir) {
        this.inputDir = inputDir;
        this.inputDir = inputDir;
    }
    run() {
        // Get all files that start with a number (timestamp) and end with .sql
        const files = node_fs_1.default
            .readdirSync(this.inputDir)
            .filter((file) => /^\d+.*\.sql$/.test(file))
            .sort();
        if (files.length === 0) {
            console.log("No SQL migration files found");
            process.exit(1);
        }
        const lastFile = files[files.length - 1];
        const timestamp = lastFile.match(/^(\d+)/)?.[1];
        if (timestamp) {
            const filesToDelete = files.filter(file => file.startsWith(timestamp));
            filesToDelete.forEach(file => {
                node_fs_1.default.unlinkSync(node_path_1.default.join(this.inputDir, file));
                console.log(`Deleted migration: ${file}`);
            });
        }
    }
}
exports.default = RevertMigration;
