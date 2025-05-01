# typeorm-raw-migraitons

A CLI tool to extract raw SQL queries from TypeORM migrations and save them as separate SQL files.

## Installation

```bash
npm install typeorm-raw-migrations
# or
yarn add typeorm-raw-migrations
# or
pnpm add typeorm-raw-migrations
```

## Usage

### Extract SQL from migrations

```bash
# Basic usage
node_modules/typeorm-raw-migrations/cli.js run <path-to-migrations-directory>

# Specify output directory
node_modules/typeorm-raw-migrations/cli.js run <path-to-migrations-directory> -o <output-directory>

# Extract only the UP migrations
node_modules/typeorm-raw-migrations/cli.js run <path-to-migrations-directory> -u
# or
node_modules/typeorm-raw-migrations/cli.js run <path-to-migrations-directory> --onlyUp
```

### Revert the last migration

```bash
node_modules/typeorm-raw-migrations/cli.js revert <path-to-sql-files-directory>
```

## Combine scripts with typeorm cli migration scripts

```json
// package.json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs",
    "db:migration:generate": "pnpm typeorm migration:generate src/db/migrations/migration -d src/db/index.ts && typeorm-raw-migrations run src/db/migrations -o src/db/migrations/sql",
    "db:migration:revert": "pnpm typeorm migration:revert -d src/db/index.ts && typeorm-raw-migrations revert src/db/migrations/sql"
  }
}
```
