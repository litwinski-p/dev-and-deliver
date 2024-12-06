import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { isExpired } from '../utils/helpers';

@Injectable()
export class FilmsService {
  private readonly filmsApiUrl = 'https://swapi.dev/api/films';

  constructor(@InjectRepository(Film) private readonly filmRepository: Repository<Film>) {
  }

  async findAll() {
    let films = await this.filmRepository.find();

    if (films.length === 0 || (films.length > 0 && isExpired(films[0]))) {

      try {
        const { data: { results: filmsData } } = await axios.get(this.filmsApiUrl);

        await this.filmRepository.clear();

        const entities: Film[] = [];
        filmsData.forEach((item) => {
          const entity = this.filmRepository.create({
            title: item.title,
            openingCrawl: item.opening_crawl,
            director: item.director,
            producer: item.producer,
            people: JSON.stringify(item.characters),
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
    try {
      const {
        data: {
          title,
          opening_crawl: openingCrawl,
          director,
          producer,
          characters,
        },
      } = await axios.get(`${this.filmsApiUrl}/${id}`);

      await this.filmRepository.clear();

      const film: Film = this.filmRepository.create({
        title,
        openingCrawl,
        director,
        producer,
        people: JSON.stringify(characters),
      });

      return this.filmRepository.save(film);
    } catch (error) {
      console.log(error);
    }
  }
}
