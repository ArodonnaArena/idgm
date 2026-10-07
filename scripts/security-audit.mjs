import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = process.cwd()
const routeFiles = []

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    if (['node_modules', '.next', '.git', 'dist', 'coverage'].includes(entry.name)) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await walk(path)
    else if (entry.name === 'route.ts' || entry.name === 'route.js') routeFiles.push(path)
  }
}

const envNames = new Set()
const sourceFiles = []
for (const folder of ['apps/web', 'apps/admin', 'backend/api', 'packages', 'supabase']) {
  const path = join(root, folder)
  if (await import('node:fs/promises').then(({ stat }) => stat(path).then(() => true, () => false))) {
    sourceFiles.push(path)
  }
}

await walk(root)
const envPattern = /process\.env(?:\.([A-Z][A-Z0-9_]*)|\[['"]([A-Z][A-Z0-9_]*)['"]\])/g
const routePattern = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)\s*\(/g
const routeReport = []
for (const file of routeFiles) {
  const source = await readFile(file, 'utf8')
  const relativePath = relative(root, file)
  const methods = [...source.matchAll(routePattern)].map((match) => match[1])
  const env = [...source.matchAll(envPattern)].map((match) => match[1] || match[2])
  const trustsUserId = /(?:body|data|dto|request\.json\(\)|searchParams)\s*(?:\.|\[)[^\n]*(?:userId|ownerId)/i.test(source)
  routeReport.push({ path: relativePath, methods, env: [...new Set(env)], trustsUserId })
}

const output = {
  generatedAt: new Date().toISOString(),
  routeCount: routeReport.length,
  routes: routeReport,
  environmentVariables: [...new Set(
    (await Promise.all(sourceFiles.map(async (file) => {
      try {
        const source = await readFile(file, 'utf8')
        return [...source.matchAll(envPattern)].map((match) => match[1] || match[2])
      } catch { return [] }
    })),
  ).flat())],
}

process.stdout.write(JSON.stringify(output, null, 2))
