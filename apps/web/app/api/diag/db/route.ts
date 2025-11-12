import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: false, code: 'NO_DB_URL' }, { status: 500 })
    }
    // Prisma MongoDB: ping using $runCommandRaw
    // @ts-ignore - available on MongoDB connector
    const res = await (prisma as any).$runCommandRaw({ ping: 1 })
    return NextResponse.json({ ok: true, res })
  } catch (error: any) {
    const code = error?.code || error?.name || error?.errorCode || 'DB_ERROR'
    const msg = error?.message || 'Unknown database error'
    return NextResponse.json({ ok: false, code, message: msg }, { status: 500 })
  }
}
