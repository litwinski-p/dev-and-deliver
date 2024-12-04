import { Injectable } from '@nestjs/common';
import { CreateFilmInput } from './dto/create-film.input';
import { UpdateFilmInput } from './dto/update-film.input';

@Injectable()
export class FilmsService {
  create(createFilmInput: CreateFilmInput) {
    return 'This action adds a new film';
  }

  findAll() {
    return `This action returns all films`;
  }

  findOne(id: number) {
    return `This action returns a #${id} film`;
  }

  update(id: number, updateFilmInput: UpdateFilmInput) {
    return `This action updates a #${id} film`;
  }

  remove(id: number) {
    return `This action removes a #${id} film`;
  }
}
