"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
class ExtractMigrations {
    inputDir;
    outputDir;
    onlyUp;
    UP_REGEX = /public\s+async\s+up\(\s*queryRunner\s*:.*?\)\s*:\s*Promise<void>\s*{([\s\S]*?)}/;
    DOWN_REGEX = /public\s+async\s+down\(\s*queryRunner\s*:.*?\)\s*:\s*Promise<void>\s*{([\s\S]*?)}/;
    constructor(inputDir, outputDir, onlyUp) {
        this.inputDir = inputDir;
        this.outputDir = outputDir;
        this.onlyUp = onlyUp;
        this.inputDir = inputDir;
        this.outputDir = outputDir;
        this.onlyUp = onlyUp;
    }
    run() {
        if (!node_fs_1.default.existsSync(this.inputDir)) {
            console.error(`Error: Input directory does not exist: ${this.inputDir}`);
            process.exit(1);
        }
        // Get all migration files
        const files = node_fs_1.default.readdirSync(this.inputDir);
        files.forEach((file) => {
            const filePath = node_path_1.default.join(this.inputDir, file);
            // Skip directories and non-js/ts files
            if (node_fs_1.default.statSync(filePath).isDirectory() || (!file.endsWith(".js") && !file.endsWith(".ts")))
                return;
            const extraction = this.extractMigrations(filePath);
            if (!extraction)
                return;
            this.writeToFile(filePath, extraction.up, "up");
            if (extraction.down)
                this.writeToFile(filePath, extraction.down, "down");
        });
    }
    getSqlStatements(content, methodContextRegex) {
        const QUERY_REGEX = /queryRunner\.query\(`(.*?)`\)/gs;
        const methodContent = content.match(methodContextRegex)?.[1] || "";
        const sqlStatements = [];
        let match;
        while ((match = QUERY_REGEX.exec(methodContent)) !== null) {
            sqlStatements.push(match[1]);
        }
        return sqlStatements;
    }
    extractMigrations(filePath) {
        if (!filePath.endsWith(".js") && !filePath.endsWith(".ts"))
            return;
        const content = node_fs_1.default.readFileSync(filePath, "utf8");
        const upSqlStatements = this.getSqlStatements(content, this.UP_REGEX);
        if (this.onlyUp)
            return { up: upSqlStatements };
        return { up: upSqlStatements, down: this.getSqlStatements(content, this.DOWN_REGEX) };
    }
    writeToFile(filePath, sqlStatements, migrationType) {
        const baseFileName = node_path_1.default.basename(filePath).replace(/.js|.ts/, "");
        const sqlOutputDir = this.outputDir || node_path_1.default.dirname(filePath);
        // Create output directory if it doesn't exist
        if (!node_fs_1.default.existsSync(sqlOutputDir)) {
            node_fs_1.default.mkdirSync(sqlOutputDir, { recursive: true });
        }
        if (sqlStatements.length > 0) {
            const upSqlFilePath = node_path_1.default.join(sqlOutputDir, `${baseFileName}.${migrationType}.sql`);
            node_fs_1.default.writeFileSync(upSqlFilePath, `${sqlStatements.join(";\n\n")};`);
            console.log(`Created ${migrationType} SQL file: ${upSqlFilePath}`);
        }
    }
}
exports.default = ExtractMigrations;
