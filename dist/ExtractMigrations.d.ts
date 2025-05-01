export default class ExtractMigrations {
    private readonly inputDir;
    private readonly outputDir?;
    private readonly onlyUp?;
    private UP_REGEX;
    private DOWN_REGEX;
    constructor(inputDir: string, outputDir?: string | undefined, onlyUp?: boolean | undefined);
    run(): void;
    getSqlStatements(content: string, methodContextRegex: RegExp): string[];
    extractMigrations(filePath: string): {
        up: string[];
        down?: undefined;
    } | {
        up: string[];
        down: string[];
    } | undefined;
    writeToFile(filePath: string, sqlStatements: string[], migrationType: "up" | "down"): void;
}
//# sourceMappingURL=ExtractMigrations.d.ts.map