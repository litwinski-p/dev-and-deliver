import { Injectable } from '@nestjs/common';
import { CreateFilmInput } from './dto/create-film.input';
import { UpdateFilmInput } from './dto/update-film.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilmsService {

  constructor(@InjectRepository(Film) private readonly filmRepository: Repository<Film>) {
  }

  create(createFilmInput: CreateFilmInput) {
    return 'This action adds a new film';
  }

  async findAll() {
    return this.filmRepository.find();
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
