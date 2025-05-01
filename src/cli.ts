#!/usr/bin/env node

import { program } from "commander"
import ExtractMigrations from "./ExtractMigrations"
import RevertMigration from "./RevertMigration"

program.description("Extract TypeORM migrations SQL raw").version("1.0.0")

program
  .command("run")
  .description("Run the extraction of SQL statements from TypeORM migrations")
  .argument("<string>", "path to the directory that contains the TypeORM migration files")
  .option("-o, --outputDir [string]", "path to the directory to save the SQL files")
  .option("-u, --onlyUp [boolean]", "only extract the up SQL statements")
  .action((inputDir: string, _options?: { inputDir?: string; outputDir?: string; onlyUp?: boolean }) => {
    const extractMigrations = new ExtractMigrations(inputDir, _options?.outputDir, _options?.onlyUp)
    extractMigrations.run()
  })

program
  .command("revert")
  .description("Revert the extraction of SQL statements from TypeORM migrations")
  .argument("<string>", "path to the directory that contains the SQL files")
  .action((inputDir: string) => {
    const revertMigration = new RevertMigration(inputDir)
    revertMigration.run()
  })

program.parse()
