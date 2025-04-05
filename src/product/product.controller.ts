import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateProductDto,
  IUpdateProduct,
  ProductQueryDto,
} from './dto/index.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { Public } from 'src/decorators/index.decorator';

@Controller('/products')
export class ProductController {
  constructor(private readonly service: ProductService) {}
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all  products' })
  @ApiResponse({ status: 200, description: 'Products fetched successfully' })
  @HttpCode(HttpStatus.OK)
  async getProducts(@Query() query: ProductQueryDto) {
    return this.service.getAllProducts(query);
  }

  @Public()
  @Get('/trending')
  @ApiOperation({ summary: 'Get trending products' })
  @ApiResponse({
    status: 200,
    description: 'Trending products fetched successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getTrendingProducts() {
    return this.service.getTrendingProducts();
  }

  @Public()
  @Get('/:productId')
  @ApiOperation({ summary: 'Get one product by Id' })
  @ApiResponse({ status: 200, description: 'Product fetched successfully' })
  @HttpCode(HttpStatus.OK)
  async getOneProduct(@Param('productId') productId: string) {
    return this.service.getProductById({ productId });
  }

  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ description: 'New Product Details', type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.service.createProduct(createProductDto);
  }

  @UseGuards(AdminGuard)
  @Patch('/:productId')
  @ApiOperation({ summary: 'Update product by Id' })
  @ApiBody({ description: 'Updated Product Details', type: CreateProductDto })
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('productId') productId: string,
    @Body() body: CreateProductDto,
  ) {
    const payload: IUpdateProduct = { productId, body };
    return this.service.updateProduct(payload);
  }

  @UseGuards(AdminGuard)
  @Delete('/:productId')
  @ApiOperation({ summary: 'Delete product by Id' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('productId') productId: string) {
    return this.service.deleteProduct({ productId });
  }

  @Public()
  @Get('/:productId/related')
  @ApiOperation({ summary: 'Get related products' })
  @ApiResponse({
    status: 200,
    description: 'Related products fetched successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getProductsRelated(@Param('productId') productId: string) {
    return this.service.getRelatedProducts({ productId });
  }
}
