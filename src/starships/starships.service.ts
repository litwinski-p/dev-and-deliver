import { Injectable } from '@nestjs/common';
import { CreateStarshipInput } from './dto/create-starship.input';
import { UpdateStarshipInput } from './dto/update-starship.input';

@Injectable()
export class StarshipsService {
  create(createStarshipInput: CreateStarshipInput) {
    return 'This action adds a new starship';
  }

  findAll() {
    return `This action returns all starships`;
  }

  findOne(id: number) {
    return `This action returns a #${id} starship`;
  }

  update(id: number, updateStarshipInput: UpdateStarshipInput) {
    return `This action updates a #${id} starship`;
  }

  remove(id: number) {
    return `This action removes a #${id} starship`;
  }
}
