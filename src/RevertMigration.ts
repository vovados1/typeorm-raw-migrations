import fs from "node:fs"
import path from "node:path"

export default class RevertMigration {
  constructor(private readonly inputDir: string) {
    this.inputDir = inputDir
  }

  run() {
    // Get all files that start with a number (timestamp) and end with .sql
    const files = fs
      .readdirSync(this.inputDir)
      .filter((file) => /^\d+.*\.sql$/.test(file))
      .sort()

    if (files.length === 0) {
      console.log("No SQL migration files found")
      process.exit(1)
    }

    const lastFile = files[files.length - 1]
    const timestamp = lastFile.match(/^(\d+)/)?.[1]

    if (timestamp) {
      const filesToDelete = files.filter((file) => file.startsWith(timestamp))

      filesToDelete.forEach((file) => {
        fs.unlinkSync(path.join(this.inputDir, file))
        console.log(`Deleted migration: ${file}`)
      })
    }
  }
}
