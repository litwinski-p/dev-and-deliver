import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { FindManyOptions, Repository } from 'typeorm';
import axios from 'axios';
import { CacheType, isExpired } from '../utils/helpers';
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


  async findAll(page: number, limit: number) {
    const findOptions: FindManyOptions = {
      where: {
        cacheType: CacheType.ALL,
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    const films = await this.filmRepository.find(findOptions);

    if (films.length === 0 || (films.length > 0 && isExpired(films[0]))) {
      try {
        const { data: { results: filmsData } } = await axios.get(this.filmsApiUrl);

        await this.filmRepository.delete({ cacheType: CacheType.ALL });

        const entities: Film[] = [];
        filmsData.forEach((item) => {
          const entity = this.filmRepository.create({
            id: Math.floor(Math.random() * (1000000 - 90000 + 1) + 90000),
            title: item.title,
            openingCrawl: item.opening_crawl,
            director: item.director,
            producer: item.producer,
            cacheType: CacheType.ALL,
          });

          entities.push(entity);
        });

        await this.filmRepository.save(entities);
        return this.filmRepository.find(findOptions);
      } catch (error) {
        console.log(error);
      }
    }

    return films;
  }

  async findOne(id: number) {
    const film = await this.filmRepository.findOne({ where: { id, cacheType: CacheType.SINGLE } });

    if (!film || (film && isExpired(film))) {
      try {
        const {
          data: {
            title,
            opening_crawl: openingCrawl,
            director,
            producer,
          },
        } = await axios.get(`${this.filmsApiUrl}/${id}`);

        if (film) {
          await this.filmRepository.delete(film.id);
        }

        const newFilm: Film = this.filmRepository.create({
          id,
          title,
          openingCrawl,
          director,
          producer,
          cacheType: CacheType.SINGLE,
        });

        return this.filmRepository.save(newFilm);
      } catch (error) {
        console.log(error);
      }
    }

    return film;
  }
}
