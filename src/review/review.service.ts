import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/database/schemas/product.schema';
import { Review } from 'src/database/schemas/review.schema';
import { ICreateReview } from './dto/index.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  //create a new review
  async createReview(payload: ICreateReview) {
    const { body, user, productId } = payload;

    // Check if the product exists before proceeding
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Check if the user has already reviewed this product
    let review = await this.reviewModel.findOneAndUpdate(
      { user, product: productId },
      { review: body.review, rating: body.rating },
      { new: true }, // Return the updated document
    );

    // If no existing review, create a new one
    if (!review) {
      review = await this.reviewModel.create({
        review: body.review,
        rating: body.rating,
        user,
        product: productId,
      });

      // Push the new review ID to the product's `reviews` array
      await this.productModel.findByIdAndUpdate(productId, {
        $push: { reviews: review._id },
      });
    }

    // Update product's average rating
    await this.updateRating(productId);

    return { message: 'Review created successfully', review };
  }

  //get all reviews for a product
  async getProductReviews({ productId }: { productId: string }) {
    const productReviews = await this.reviewModel
      .find({ product: productId })
      .populate('user', 'name email')
      .exec();

    return { message: 'Reviews fetched successfully', reviews: productReviews };
  }

  //get one product review
  async getReviewById({ reviewId }: { reviewId: string }) {
    const review = await this.reviewModel
      .findById(reviewId)
      .populate('user', 'name email')
      .exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return { message: 'Review fetched successfully', review };
  }

  //delete a review for a user
  async deleteReview({ reviewId, userId }) {
    // Find the review to check if it exists
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Ensure the user deleting the review is the owner
    if (review.user.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }

    // Delete the review from the Review collection
    await this.reviewModel.findByIdAndDelete(reviewId);

    //  Remove the review reference from the Product's reviews array
    await this.productModel.findByIdAndUpdate(review.product, {
      $pull: { reviews: reviewId },
    });

    return { message: 'Review deleted successfully' };
  }

  //get total review count for a product
  async getTotalReviewsForProduct({ productId }: { productId: string }) {
    const totalReviews = await this.reviewModel.countDocuments({
      product: productId,
    });

    return { message: 'Total reviews fetched successfully', totalReviews };
  }

  //get all user reviews
  async getUserReviews({ userId }: { userId: string }) {
    const userReviews = await this.reviewModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('product', 'name')
      .exec();

    if (userReviews.length === 0) {
      return { message: 'No reviews found for this user' };
    }

    return {
      message: 'User reviews fetched successfully',
      reviews: userReviews,
    };
  }

  //get user review for a product
  async getUserReviewByUserId({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) {
    const userReview = await this.reviewModel
      .findOne({ user: userId, product: productId })
      .exec();

    if (!userReview) {
      return { message: 'No review found for this user on this product' };
    }

    return { message: 'User review fetched successfully', review: userReview };
  }

  private async updateRating(productId) {
    //get all reviews for this product
    const productReviews = await this.reviewModel.find({ product: productId });

    const averageRating = productReviews.length
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) /
        productReviews.length
      : 0;
    await this.productModel.findByIdAndUpdate(productId, {
      averageRating: averageRating,
    });
  }
}
