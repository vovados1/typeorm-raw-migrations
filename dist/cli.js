#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const ExtractMigrations_1 = __importDefault(require("./ExtractMigrations"));
const RevertMigration_1 = __importDefault(require("./RevertMigration"));
commander_1.program.description("Extract TypeORM migrations SQL raw").version("1.0.0");
commander_1.program
    .command("run")
    .description("Run the extraction of SQL statements from TypeORM migrations")
    .argument("<string>", "path to the directory that contains the TypeORM migration files")
    .option("-o, --outputDir [string]", "path to the directory to save the SQL files")
    .option("-u, --onlyUp [boolean]", "only extract the up SQL statements")
    .action((inputDir, _options) => {
    const extractMigrations = new ExtractMigrations_1.default(inputDir, _options?.outputDir, _options?.onlyUp);
    extractMigrations.run();
});
commander_1.program
    .command("revert")
    .description("Revert the extraction of SQL statements from TypeORM migrations")
    .argument("<string>", "path to the directory that contains the SQL files")
    .action((inputDir) => {
    const revertMigration = new RevertMigration_1.default(inputDir);
    revertMigration.run();
});
commander_1.program.parse();
