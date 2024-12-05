import { Injectable } from '@nestjs/common';
import { CreateFilmInput } from './dto/create-film.input';
import { UpdateFilmInput } from './dto/update-film.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as dayjs from 'dayjs';

@Injectable()
export class FilmsService {
  private readonly apiUrl = 'https://swapi.dev/api/films';

  // private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(@InjectRepository(Film) private readonly filmRepository: Repository<Film>) {
  }

  create(createFilmInput: CreateFilmInput) {
    return 'This action adds a new film';
  }

  async findAll() {
    let films = await this.filmRepository.find();

    if (films.length === 0 || (films.length > 0 && this.isExpired(films[0]))) {
      const { data: { results: filmsData } } = await axios.get(this.apiUrl);

      await this.filmRepository.clear();

      const entities: Film[] = [];
      filmsData.forEach((item) => {
        const entity = this.filmRepository.create({
          title: item.title,
          openingCrawl: item.opening_crawl,
          director: item.director,
          producer: item.producer,
        });

        entities.push(entity);
      });

      return this.filmRepository.save(entities);
    }

    return films;
  }

  isExpired(record) {
    return dayjs(record.createdAt).isBefore(dayjs().subtract(24, 'hours'));
  }


  async findOne(id: number) {
    const film = this.filmRepository.findOneBy({ id });
    if (!film || (film && this.isExpired(film))) {
      try {
        const data: {
          title: string,
          opening_crawl: string,
          director: string,
          producer: string
        } = await axios.get(`${this.apiUrl}/${id}`);

        await this.filmRepository.clear();

        const film: Film = this.filmRepository.create({
          title: data.title,
          openingCrawl: data.opening_crawl,
          director: data.director,
          producer: data.producer,
        });

        return this.filmRepository.save(film);
      } catch (error) {
        console.log(error);
      }
    }

    return film;
  }

  update(id: number, updateFilmInput: UpdateFilmInput) {
    return `This action updates a #${id} film`;
  }

  remove(id: number) {
    return `This action removes a #${id} film`;
  }
}
