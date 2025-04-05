import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from 'src/database/schemas/address.schema';

@Injectable()
export class AddressService {
  constructor(@InjectModel(Address.name) private address: Model<Address>) {}

  async create(userId: string, body) {
    const address = new this.address({
      ...body,
      user: userId,
    });
    await address.save();
    return {
      message: 'Address created successfully',
      address,
    };
  }

  async findAll(): Promise<{ message: string; addresses: Address[] }> {
    const addresses = await this.address.find().populate('user').exec();
    return {
      message: 'Addresses fetched successfully',
      addresses,
    };
  }

  async findOne(id: string): Promise<{ message: string; address: Address }> {
    const address = await this.address.findById(id).populate('user');
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return {
      message: 'Address fetched successfully',
      address,
    };
  }

  async update(
    id: string,
    body,
  ): Promise<{ message: string; address: Address }> {
    const address = await this.address.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return {
      message: 'Address updated successfully',
      address,
    };
  }

  async delete(id: string): Promise<{ message: string }> {
    const address = await this.address.findByIdAndDelete(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return { message: 'Address deleted successfully' };
  }
}
