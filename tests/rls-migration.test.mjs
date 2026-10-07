import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const migration = await readFile(
  new URL('../supabase/rls-policies.sql', import.meta.url),
  'utf8',
)
const schema = await readFile(
  new URL('../supabase/schema.sql', import.meta.url),
  'utf8',
)

test('RLS migration covers only schema tables and enforces ownership', () => {
  const tableNames = [...schema.matchAll(/^create table if not exists public\.([a-z_]+)/gm)].map(
    ([, name]) => name,
  )
  const referencedTables = [...migration.matchAll(/alter table public\.([a-z_]+)/g)].map(
    ([, name]) => name,
  )

  assert.ok(referencedTables.length > 0)
  for (const table of referencedTables) {
    assert.ok(tableNames.includes(table), `Unknown table in RLS migration: ${table}`)
  }

  const normalizedMigration = migration.replace(/\s+/g, ' ')
  assert.match(normalizedMigration, /public\.users for select using \(auth\.uid\(\) = id\)/)
  assert.match(normalizedMigration, /public\.orders for all using \(auth\.uid\(\) = user_id\)/)
  assert.match(normalizedMigration, /public\.cart_items for all using \( exists/)
  assert.match(normalizedMigration, /public\.user_roles for all using \( exists/)
})
