import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateReviewDto, ICreateReview } from './dto/index.dto';

@Controller()
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Get('products/:productId/reviews')
  @ApiOperation({ summary: 'Get all  reviews for a particular  product' })
  @ApiResponse({ status: 200, description: 'Reviews fetched successfully' })
  @HttpCode(HttpStatus.OK)
  async getReviews(@Param('productId') productId: string) {
    return this.service.getProductReviews({ productId });
  }

  @Get('products/:productId/reviews/total')
  @ApiOperation({
    summary: 'Get total number of reviews for a particular  product',
  })
  @ApiResponse({
    status: 200,
    description: 'Total reviews fetched successfully',
  })
  @HttpCode(HttpStatus.OK)
  async getTotalReviews(@Param('productId') productId: string) {
    return this.service.getTotalReviewsForProduct({ productId });
  }

  @Get('products/:productId/reviews/user')
  @ApiOperation({
    summary: 'Get review written by a particular user for a product',
  })
  @ApiResponse({ status: 200, description: 'Revies fetched successfully' })
  @HttpCode(HttpStatus.OK)
  async getUserReviewsByUser(@Req() req, @Param('productId') productId) {
    return this.service.getUserReviewByUserId({
      userId: req.user.userId,
      productId,
    });
  }

  @Get('reviews/user')
  @ApiOperation({ summary: 'Get all reviews written by a particular user' })
  @ApiResponse({ status: 200, description: 'Reviews fetched successfully' })
  @HttpCode(HttpStatus.OK)
  async getUserReviews(@Req() req) {
    return this.service.getUserReviews({ userId: req.user._id });
  }

  @Get('products/:productId/reviews/:reviewId')
  @ApiOperation({ summary: 'Get one review by Id' })
  @ApiResponse({ status: 200, description: 'Review fetched successfully' })
  @HttpCode(HttpStatus.OK)
  async getReview(@Param('reviewId') reviewId: string) {
    return this.service.getReviewById({ reviewId });
  }

  @Post('products/:productId/reviews')
  @ApiOperation({ summary: 'Create a new review for a particular  product' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async createNewReview(
    @Param('productId') productId: string,
    @Body() body: CreateReviewDto,
    @Req() req,
  ) {
    const user = req?.user?.userId;
    const payload: ICreateReview = { productId, body, user };
    return this.service.createReview(payload);
  }

  @Delete('products/:productId/reviews/:reviewId')
  @ApiOperation({ summary: 'Delete review by Id' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @HttpCode(HttpStatus.OK)
  async deleteReview(@Param('reviewId') reviewId: string, @Req() req) {
    const userId = req?.user?.userId;
    return this.service.deleteReview({ reviewId, userId });
  }
}
