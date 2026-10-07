import { Controller, Get, Post, Put, Param, Body, Query, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { OrdersService } from './orders.service'
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async list(
    @Request() request: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
  ) {
    const userId = request.user.userId
    const skipNum = skip ? parseInt(skip, 10) : 0
    const takeNum = take ? parseInt(take, 10) : 50
    return this.orders.list(skipNum, takeNum, status, userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async get(@Request() request: any, @Param('id') id: string) {
    if (!request.user.roles.includes('ADMIN') && !request.user.roles.includes('STAFF')) {
      return this.orders.getOwned(id, request.user.userId)
    }
    return this.orders.get(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() request: any, @Body() dto: CreateOrderDto) {
    return this.orders.create(dto, request.user.userId)
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orders.updateStatus(id, dto)
  }
}
