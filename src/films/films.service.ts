import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { isExpired } from '../utils/helpers';
import { People } from './entities/people.entity';

@Injectable()
export class FilmsService implements OnApplicationBootstrap {
  private readonly filmsApiUrl = 'https://swapi.dev/api/films';
  private readonly peopleApiUrl = 'https://swapi.dev/api/people';

  constructor(
    @InjectRepository(Film) private readonly filmRepository: Repository<Film>,
    @InjectRepository(People) private readonly peopleRepository: Repository<People>,
  ) {
  }

  async onApplicationBootstrap(): Promise<any> {
    let people = await this.peopleRepository.find();

    if (people.length === 0 || (people.length > 0 && isExpired(people[0]))) {
      console.log('Loading people data...');

      let nextUrl = this.peopleApiUrl;
      const entities: People[] = [];

      while (nextUrl) {
        try {
          const { data: { next, results: peopleData } } = await axios.get(nextUrl);

          peopleData.forEach((item) => {
            const entity = this.peopleRepository.create({
              name: item.name,
            });

            entities.push(entity);
          });

          nextUrl = next;
        } catch (error) {
          console.log(error);
        }
      }
      await this.peopleRepository.save(entities);
      console.log('People data loaded.');
    }
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
        },
      } = await axios.get(`${this.filmsApiUrl}/${id}`);

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
}
