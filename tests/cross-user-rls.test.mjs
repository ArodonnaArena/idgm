import assert from 'node:assert/strict'
import test from 'node:test'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const testTable = process.env.TEST_TABLE || 'owner_records'

const hasCredentials = Boolean(supabaseUrl && supabaseAnonKey)

if (!hasCredentials) {
  test.skip('Set SUPABASE_URL and SUPABASE_ANON_KEY to run the authenticated RLS test')
} else {
  test('user B cannot read, update, or delete user A records', async () => {
    assert.ok(supabaseUrl && supabaseAnonKey)

    const aClient = createClient(supabaseUrl, supabaseAnonKey)
    const bClient = createClient(supabaseUrl, supabaseAnonKey)
    const unique = `cross-user-${crypto.randomUUID()}`
    const aEmail = `owner-a-${unique}@example.invalid`
    const bEmail = `owner-b-${unique}@example.invalid`

    const { data: aUser, error: aSignUpError } = await aClient.auth.signUp({
      email: aEmail,
      password: 'test-password-123',
    })
    assert.ifError(aSignUpError)
    assert.ok(aUser.user.id)

    const { data: bUser, error: bSignUpError } = await bClient.auth.signUp({
      email: bEmail,
      password: 'test-password-123',
    })
    assert.ifError(bSignUpError)
    assert.ok(bUser.user.id)

    const { error: aInsertError } = await aClient.from(testTable).insert({
      id: unique,
      owner_id: aUser.user.id,
      value: 'only-user-a',
    })
    assert.ifError(aInsertError)

    const { data: readRows } = await bClient.from(testTable).select('*').eq('id', unique)
    assert.equal(readRows?.length || 0, 0)

    const { error: updateError } = await bClient.from(testTable).update({
      value: 'tampered',
    }).eq('id', unique)
    assert.ok(updateError, 'User B must be denied update access to user A row')

    const { error: deleteError } = await bClient.from(testTable).delete().eq('id', unique)
    assert.ok(deleteError, 'User B must be denied delete access to user A row')

    const { data: remaining } = await aClient.from(testTable).select('id').eq('id', unique)
    assert.equal(remaining?.length || 0, 1)
  })
}
