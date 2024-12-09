import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Starship } from './entities/starship.entity';
import { CacheType, isExpired } from '../utils/helpers';

@Injectable()
export class StarshipsService {
  private readonly apiUrl = 'https://swapi.dev/api/starships';

  constructor(@InjectRepository(Starship) private readonly starshipRepository: Repository<Starship>) {
  }

  async findAll() {
    let starships = await this.starshipRepository.find({ where: { cacheType: CacheType.ALL } });

    if (starships.length === 0 || (starships.length > 1 && isExpired(starships[0]))) {
      await this.starshipRepository.clear();
      let nextUrl = this.apiUrl;

      const entities: Starship[] = [];
      while (nextUrl) {
        try {
          const { data: { next, results } } = await axios.get(nextUrl);

          for (const item of results) {
            entities.push(this.starshipRepository.create({
              id: Math.floor(Math.random() * (100000 - 90000 + 1) + 90000),
              data: JSON.stringify(item),
            }));
          }

          nextUrl = next;
        } catch (error) {
          console.log(error);
        }
      }

      return this.starshipRepository.save(entities);
    }

    return starships;
  }

  async findOne(id: number) {
    const starship = await this.starshipRepository.findOne({ where: { id, cacheType: CacheType.SINGLE } });

    if (!starship || (starship && isExpired(starship))) {
      try {
        const { data } = await axios.get(`${this.apiUrl}/${id}`);

        if (starship) {
          await this.starshipRepository.delete(starship.id);
        }

        const newStarship: Starship = this.starshipRepository.create({
          id: data.url.match(/\/(\d+)\/?$/)[1],
          data: JSON.stringify(data),
          cacheType: CacheType.SINGLE,
        });

        return this.starshipRepository.save(newStarship);
      } catch (error) {
        console.log(error);
      }
    }

    return starship;
  }
}
