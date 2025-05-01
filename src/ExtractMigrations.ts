import fs from "node:fs"
import path from "node:path"

export default class ExtractMigrations {
  private UP_REGEX = /public\s+async\s+up\(\s*queryRunner\s*:.*?\)\s*:\s*Promise<void>\s*{([\s\S]*?)}/
  private DOWN_REGEX = /public\s+async\s+down\(\s*queryRunner\s*:.*?\)\s*:\s*Promise<void>\s*{([\s\S]*?)}/

  constructor(
    private readonly inputDir: string,
    private readonly outputDir?: string,
    private readonly onlyUp?: boolean
  ) {
    this.inputDir = inputDir
    this.outputDir = outputDir
    this.onlyUp = onlyUp
  }

  run() {
    if (!fs.existsSync(this.inputDir)) {
      console.error(`Error: Input directory does not exist: ${this.inputDir}`)
      process.exit(1)
    }

    // Get all migration files
    const files = fs.readdirSync(this.inputDir)

    files.forEach((file) => {
      const filePath = path.join(this.inputDir, file)

      // Skip directories and non-js/ts files
      if (fs.statSync(filePath).isDirectory() || (!file.endsWith(".js") && !file.endsWith(".ts"))) return

      const extraction = this.extractMigrations(filePath)
      if (!extraction) return

      this.writeToFile(filePath, extraction.up, "up")
      if (extraction.down) this.writeToFile(filePath, extraction.down, "down")
    })
  }

  getSqlStatements(content: string, methodContextRegex: RegExp) {
    const QUERY_REGEX = /queryRunner\.query\(`(.*?)`\)/gs
    const methodContent = content.match(methodContextRegex)?.[1] || ""
    const sqlStatements = []
    let match

    while ((match = QUERY_REGEX.exec(methodContent)) !== null) {
      sqlStatements.push(match[1])
    }

    return sqlStatements
  }

  extractMigrations(filePath: string) {
    if (!filePath.endsWith(".js") && !filePath.endsWith(".ts")) return

    const content = fs.readFileSync(filePath, "utf8")
    const upSqlStatements = this.getSqlStatements(content, this.UP_REGEX)

    if (this.onlyUp) return { up: upSqlStatements }
    return { up: upSqlStatements, down: this.getSqlStatements(content, this.DOWN_REGEX) }
  }

  writeToFile(filePath: string, sqlStatements: string[], migrationType: "up" | "down") {
    const baseFileName = path.basename(filePath).replace(/.js|.ts/, "")
    const sqlOutputDir = this.outputDir || path.dirname(filePath)

    // Create output directory if it doesn't exist
    if (!fs.existsSync(sqlOutputDir)) {
      fs.mkdirSync(sqlOutputDir, { recursive: true })
    }

    if (sqlStatements.length > 0) {
      const upSqlFilePath = path.join(sqlOutputDir, `${baseFileName}.${migrationType}.sql`)
      fs.writeFileSync(upSqlFilePath, `${sqlStatements.join(";\n\n")};`)
      console.log(`Created ${migrationType} SQL file: ${upSqlFilePath}`)
    }
  }
}
