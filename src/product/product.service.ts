import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/database/schemas/product.schema';
import { CreateProductDto, IUpdateProduct } from './dto/index.dto';
import { Review } from 'src/database/schemas/review.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private product: Model<Product>,
    @InjectModel(Review.name) private review: Model<Review>,
  ) {}

  //create product
  async createProduct({
    name,
    category,
    description,
    price,
    image,
    color,
    author,
  }: CreateProductDto) {
    const newProduct = new this.product({
      name,
      category,
      description,
      price,
      image,
      color,
      author,
    });
    return await newProduct.save();
  }

  //get all products
  async getAllProducts({
    page = 1,
    limit = 10,
    category,
    color,
    minPrice,
    maxPrice,
  }: {
    page: number;
    limit: number;
    category?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    // Ensure page and limit are positive numbers
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (category && category !== 'all') filter.category = category;
    if (color && color !== 'all') filter.color = color;
    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }
    // Fetch products with pagination
    const products = await this.product
      .find(filter)
      .skip(skip)
      .limit(limit)
      .populate('author', 'email firstname lastname')
      .populate('reviews', 'rating comment ')
      .sort({ createdAt: -1 })
      .exec();

    // Get total product count
    const totalProducts = await this.product.countDocuments(filter);

    return {
      message: 'Products fetched successfully',
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    };
  }

  //get product by id
  async getProductById({ productId }: { productId: string }) {
    const product = await this.product
      .findById(productId)
      .populate('author', 'email firstname lastname')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'firstname',
        },
      })

      .exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    console.log(product);
    return {
      message: 'Product fetched successfully',
      product,
    };
  }

  //update product by id
  async updateProduct(payload: IUpdateProduct) {
    const { productId, body } = payload;
    const product = await this.product
      .findByIdAndUpdate(productId, body, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      message: 'Product updated successfully',
      product,
    };
  }

  //delete product by id
  async deleteProduct({ productId }: { productId: string }) {
    const product = await this.product.findByIdAndDelete(productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    //delete all reviews associated with this product
    await this.review.deleteMany({ product: productId });
    return {
      message: 'Product deleted successfully',
    };
  }

  //get related products
  async getRelatedProducts({ productId }: { productId: string }) {
    const product = await this.product.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Generate regex pattern from product name
    const regexPattern = product.name
      .split(/\s+/) // Split into words
      .filter((word) => word.length > 1) // Remove short words
      .join('|'); // Join with OR for regex

    const regex = new RegExp(regexPattern, 'i');

    const products = this.product
      .find({
        _id: { $ne: productId }, // Exclude current product
        name: regex, // Match similar words in product name
      })
      .limit(5);

    return {
      message: 'Related products fetched successfully',
      products,
    };
  }

  //get trending products
  async getTrendingProducts() {
    const products = await this.product.find({ isTrending: true }).exec();

    return {
      message: 'Trending products fetched successfully',
      products,
    };
  }
}
