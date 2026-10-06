import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CartService } from './cart.service'
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto'

interface JwtUserRequest extends Request {
  user: { userId: string; email: string; roles: string[] }
}

@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: JwtUserRequest) {
    return this.cartService.getCart(req.user.userId)
  }

  @Post()
  async addToCart(@Req() req: JwtUserRequest, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(req.user.userId, dto)
  }

  @Put()
  async updateItem(@Req() req: JwtUserRequest, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(req.user.userId, dto)
  }

  @Delete()
  async removeItem(@Req() req: JwtUserRequest, @Query('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.userId, itemId)
  }
}
