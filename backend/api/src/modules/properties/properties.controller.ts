import { Controller, Get, Param, Query } from '@nestjs/common'
import { prisma as supabase } from '../../../../../packages/lib/src/prisma'

@Controller('properties')
export class PropertiesController {
  private readonly prisma = supabase

  @Get()
  async list(@Query('q') q?: string) {
    return this.prisma.property.findMany({
      where: { isActive: true, OR: q ? [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] : undefined },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string) {
    return this.prisma.property.findUnique({ where: { slug }, include: { images: true, units: true } })
  }
}
