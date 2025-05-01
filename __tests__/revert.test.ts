import fs from "node:fs"
import path from "node:path"
import { beforeEach, afterEach, describe, it, expect } from "vitest"
import { execSync } from "child_process"

describe("TypeORM Raw Migrations CLI - Revert Command", () => {
  const tempOutputDir = path.join(__dirname, "temp-revert")

  beforeEach(() => {
    // Create temp output directory if it doesn't exist
    if (!fs.existsSync(tempOutputDir)) {
      fs.mkdirSync(tempOutputDir, { recursive: true })
    }

    // Create some test migration files in the temp directory
    const testMigrations = [
      "1745953724513-migration.up.sql",
      "1745953724513-migration.down.sql",
      "1745953762869-migration.up.sql",
      "1745953762869-migration.down.sql",
      "1745953787526-migration.up.sql",
      "1745953787526-migration.down.sql",
      "1745954586168-migration.up.sql",
      "1745954586168-migration.down.sql",
    ]

    testMigrations.forEach((file) => {
      fs.writeFileSync(path.join(tempOutputDir, file), `Test content for ${file}`)
    })
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

  it("should revert the latest migration (delete files with the latest timestamp)", () => {
    // Get the list of files before reverting
    const beforeFiles = fs.readdirSync(tempOutputDir)

    // Run the revert command
    execSync(`pnpm start revert ${tempOutputDir}`, { encoding: "utf8" })

    // Get the list of files after reverting
    const afterFiles = fs.readdirSync(tempOutputDir)

    // The latest migration files (with timestamp 1745954586168) should be deleted
    expect(beforeFiles).toContain("1745954586168-migration.up.sql")
    expect(beforeFiles).toContain("1745954586168-migration.down.sql")
    expect(afterFiles).not.toContain("1745954586168-migration.up.sql")
    expect(afterFiles).not.toContain("1745954586168-migration.down.sql")

    // Other migration files should still exist
    expect(afterFiles).toContain("1745953724513-migration.up.sql")
    expect(afterFiles).toContain("1745953724513-migration.down.sql")
    expect(afterFiles).toContain("1745953762869-migration.up.sql")
    expect(afterFiles).toContain("1745953762869-migration.down.sql")
    expect(afterFiles).toContain("1745953787526-migration.up.sql")
    expect(afterFiles).toContain("1745953787526-migration.down.sql")
  })

  it("should handle an empty directory gracefully", () => {
    // Clean up the directory
    const files = fs.readdirSync(tempOutputDir)
    files.forEach((file) => {
      fs.unlinkSync(path.join(tempOutputDir, file))
    })

    // Try to run the revert command on an empty directory
    try {
      execSync(`pnpm start revert ${tempOutputDir}`, { encoding: "utf8" })
      // Should not reach here
      expect(true).toBe(false)
    } catch (error: any) {
      // Only check that the command failed with a non-zero exit code
      expect(error.status).not.toBe(0)
    }
  })

  it("should handle a directory with no SQL migration files gracefully", () => {
    // Clean up the directory
    const files = fs.readdirSync(tempOutputDir)
    files.forEach((file) => {
      fs.unlinkSync(path.join(tempOutputDir, file))
    })

    // Create some non-migration files
    fs.writeFileSync(path.join(tempOutputDir, "readme.txt"), "This is not a migration file")
    fs.writeFileSync(path.join(tempOutputDir, "config.json"), '{"key": "value"}')

    // Try to run the revert command on a directory with no migration files
    try {
      execSync(`pnpm start revert ${tempOutputDir}`, { encoding: "utf8" })
      // Should not reach here
      expect(true).toBe(false)
    } catch (error: any) {
      // Only check that the command failed with a non-zero exit code
      expect(error.status).not.toBe(0)
    }
  })
})
