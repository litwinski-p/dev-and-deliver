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

      try {
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
      } catch (error) {
        console.log(error);
      }
    }

    return films;
  }

  async findOne(id: number) {
    const film = await this.filmRepository.findOneBy({ id });
    if (!film || (film && this.isExpired(film))) {
      try {
        const {
          data: {
            title,
            opening_crawl: openingCrawl,
            director,
            producer,
          },
        } = await axios.get(`${this.apiUrl}/${id}`);

        await this.filmRepository.clear();

        const film: Film = this.filmRepository.create({
          title,
          openingCrawl,
          director,
          producer,
        });

        return this.filmRepository.save(film);
      } catch (error) {
        console.log(error);
      }
    }

    let str = film.openingCrawl.toLowerCase().replace(/[^\w\s]+/gm, '');
    str = str.replace(/[\r\n|\n|\r]+/gm, ' ');
    const words = str.split(/\s+/);

    const countOfUniqueWords = {};
    for(const word of words) {
      countOfUniqueWords[word] = (countOfUniqueWords[word] || 0) + 1;
    }

    console.log(countOfUniqueWords);

    return film;
  }

  isExpired(record) {
    return dayjs(record.createdAt).isBefore(dayjs().subtract(24, 'hours'));
  }

  update(id: number, updateFilmInput: UpdateFilmInput) {
    return `This action updates a #${id} film`;
  }

  remove(id: number) {
    return `This action removes a #${id} film`;
  }
}
