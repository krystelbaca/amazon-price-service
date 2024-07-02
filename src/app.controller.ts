import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ProductDetails } from './product-details.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('price')
  async getPrice(@Query('product') product: string): Promise<ProductDetails> {
    return this.appService.getBestPricedProduct(product);
  }
}
