import fs from "node:fs"
import path from "node:path"
import { beforeEach, afterEach, describe, it, expect } from "vitest"
import { execSync } from "child_process"

describe("TypeORM Raw Migrations CLI", () => {
  const resourcesDir = path.join(__dirname, "resources")
  const tsDir = path.join(resourcesDir, "ts")
  const sqlDir = path.join(resourcesDir, "sql")
  const tempOutputDir = path.join(__dirname, "temp-output")

  beforeEach(() => {
    // Create temp output directory if it doesn't exist
    if (!fs.existsSync(tempOutputDir)) {
      fs.mkdirSync(tempOutputDir, { recursive: true })
    }
  })

  afterEach(() => {
    // Clean up temp output directory
    if (fs.existsSync(tempOutputDir)) {
      const files = fs.readdirSync(tempOutputDir)
      files.forEach((file) => {
        fs.unlinkSync(path.join(tempOutputDir, file))
      })
      fs.rmdirSync(tempOutputDir)
    }
  })

  it("should extract migrations to the same directory by default", () => {
    // Run the CLI command
    const result = execSync(`pnpm start run ${tsDir}`, { encoding: "utf8" })

    // Check if files were created in the ts directory
    const tsFiles = fs.readdirSync(tsDir)
    const sqlMigrationFiles = tsFiles
      .filter((file) => file.endsWith(".ts"))
      .flatMap((file) => {
        const baseName = file.replace(".ts", "")
        return [`${baseName}.up.sql`, `${baseName}.down.sql`]
      })

    sqlMigrationFiles.forEach((sqlFile) => {
      const filePath = path.join(tsDir, sqlFile)
      expect(fs.existsSync(filePath)).toBe(true)

      // Clean up the created files
      fs.unlinkSync(filePath)
    })
  })

  it("should extract migrations to a specified output directory with -o flag", () => {
    // Run the CLI command with output directory
    const result = execSync(`pnpm start run ${tsDir} -o ${tempOutputDir}`, { encoding: "utf8" })

    // Get all migration files
    const tsFiles = fs.readdirSync(tsDir)

    // Check if all migration files were processed correctly
    tsFiles
      .filter((f) => f.endsWith(".ts"))
      .forEach((file) => {
        const baseName = file.replace(".ts", "")
        const upSqlFile = `${baseName}.up.sql`
        const downSqlFile = `${baseName}.down.sql`

        // Check if up and down SQL files exist in the output directory
        expect(fs.existsSync(path.join(tempOutputDir, upSqlFile))).toBe(true)
        expect(fs.existsSync(path.join(tempOutputDir, downSqlFile))).toBe(true)

        // Check if content matches the expected content
        const generatedUpSql = fs.readFileSync(path.join(tempOutputDir, upSqlFile), "utf8")
        const generatedDownSql = fs.readFileSync(path.join(tempOutputDir, downSqlFile), "utf8")

        const expectedUpSql = fs.readFileSync(path.join(sqlDir, upSqlFile), "utf8")
        const expectedDownSql = fs.readFileSync(path.join(sqlDir, downSqlFile), "utf8")

        expect(generatedUpSql).toBe(expectedUpSql)
        expect(generatedDownSql).toBe(expectedDownSql)
      })
  })

  it("should extract only up migrations with -u flag", () => {
    // Run the CLI command with onlyUp flag
    const result = execSync(`pnpm start run ${tsDir} -o ${tempOutputDir} -u`, { encoding: "utf8" })

    // Get all migration files
    const tsFiles = fs.readdirSync(tsDir)

    // Check if all migration files were processed correctly
    tsFiles
      .filter((f) => f.endsWith(".ts"))
      .forEach((file) => {
        const baseName = file.replace(".ts", "")
        const upSqlFile = `${baseName}.up.sql`
        const downSqlFile = `${baseName}.down.sql`

        // Check if only up SQL files exist in the output directory
        expect(fs.existsSync(path.join(tempOutputDir, upSqlFile))).toBe(true)
        expect(fs.existsSync(path.join(tempOutputDir, downSqlFile))).toBe(false)

        // Check if content matches the expected content
        const generatedUpSql = fs.readFileSync(path.join(tempOutputDir, upSqlFile), "utf8")
        const expectedUpSql = fs.readFileSync(path.join(sqlDir, "only-up", upSqlFile), "utf8")

        expect(generatedUpSql).toBe(expectedUpSql)
      })
  })

  it("should handle --outputDir and --onlyUp as long-form flags", () => {
    // Run the CLI command with long-form flags
    const result = execSync(`pnpm start run ${tsDir} --outputDir ${tempOutputDir} --onlyUp`, { encoding: "utf8" })

    // Get all migration files
    const tsFiles = fs.readdirSync(tsDir)

    // Check if all migration files were processed correctly
    tsFiles
      .filter((f) => f.endsWith(".ts"))
      .forEach((file) => {
        const baseName = file.replace(".ts", "")
        const upSqlFile = `${baseName}.up.sql`
        const downSqlFile = `${baseName}.down.sql`

        // Check if only up SQL files exist in the output directory
        expect(fs.existsSync(path.join(tempOutputDir, upSqlFile))).toBe(true)
        expect(fs.existsSync(path.join(tempOutputDir, downSqlFile))).toBe(false)

        // Check if content matches the expected content
        const generatedUpSql = fs.readFileSync(path.join(tempOutputDir, upSqlFile), "utf8")
        const expectedUpSql = fs.readFileSync(path.join(sqlDir, "only-up", upSqlFile), "utf8")

        expect(generatedUpSql).toBe(expectedUpSql)
      })
  })

  it("should handle non-existent input directory gracefully", () => {
    // Try to run the CLI command with a non-existent input directory
    try {
      execSync(`pnpm start run ${path.join(__dirname, "non-existent-dir")}`, { encoding: "utf8" })
      // Should not reach here
      expect(true).toBe(false)
    } catch (error: any) {
      expect(error.status).not.toBe(0)
      expect(error.stderr.toString()).toContain("Error: Input directory does not exist")
    }
  })
})
