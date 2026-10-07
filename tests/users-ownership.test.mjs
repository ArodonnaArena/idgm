import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const controllerSource = await readFile(
  new URL('../backend/api/src/modules/users/users.controller.ts', import.meta.url),
  'utf8',
)

test('user read routes require authenticated staff or administrators', () => {
  assert.match(controllerSource, /@UseGuards\(AuthGuard\('jwt'\), RolesGuard\)\s*\n  @Roles\('ADMIN', 'STAFF'\)\s*\n  @Get\(\)/)
  assert.match(controllerSource, /@UseGuards\(AuthGuard\('jwt'\), RolesGuard\)\s*\n  @Roles\('ADMIN', 'STAFF'\)\s*\n  @Get\(':id'\)/)
})
