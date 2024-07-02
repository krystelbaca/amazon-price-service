import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { ProductDetails } from './product-details.interface';

@Injectable()
export class AppService {
  private apiKey: string;
  private amazonDomain: string;
  private currency: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('API_KEY');
    this.amazonDomain = this.configService.get<string>('AMAZON_DOMAIN');
    this.currency = this.configService.get<string>('CURRENCY');
  }

  async searchProducts(productName: string): Promise<any[]> {
    const params = {
      api_key: this.apiKey,
      type: 'search',
      amazon_domain: this.amazonDomain,
      search_term: productName,
      output: 'json',
    };

    try {
      const response = await axios.get(
        'https://api.rainforestapi.com/request',
        { params },
      );

      return response.data.search_results;
    } catch (error) {
      console.error('Error searching for products on Amazon:', error);
      throw new Error('Failed to search for products');
    }
  }
  async getBestPricedProduct(productName: string): Promise<ProductDetails> {
    const products = await this.searchProducts(productName);
    if (products.length === 0) {
      throw new Error('No products found');
    }

    const pricedProducts = products
      .filter((product) => product.price && product.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating);

    if (pricedProducts.length === 0) {
      throw new Error('No products with prices and sufficient rating found');
    }

    const bestProduct = pricedProducts[0];
    return {
      Nombre: productName,
      Descripción: bestProduct.title,
      Precio: bestProduct.price.raw,
      Imagen: bestProduct.image,
      URL: bestProduct.link,
    };
  }
}
