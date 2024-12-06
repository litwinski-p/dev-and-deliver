import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Starship } from './entities/starship.entity';
import { isExpired } from '../utils/helpers';

@Injectable()
export class StarshipsService {
  private readonly apiUrl = 'https://swapi.dev/api/starships';

  constructor(@InjectRepository(Starship) private readonly starshipRepository: Repository<Starship>) {
  }

  async findAll() {
    let starships = await this.starshipRepository.find();

    if (starships.length === 0 || (starships.length > 1 && isExpired(starships[0]))) {
      await this.starshipRepository.clear();
      let nextUrl = this.apiUrl;

      const entities: Starship[] = [];
      while (nextUrl) {
        try {
          const { data: { next, results } } = await axios.get(nextUrl);

          for (const item of results) {
            entities.push(this.starshipRepository.create({
              id: item.url.match(/\/(\d+)\/?$/)[1],
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
    const starship = await this.starshipRepository.findOneBy({ id });
    if (!starship || (starship && isExpired(starship))) {
      try {
        const { data } = await axios.get(`${this.apiUrl}/${id}`);

        await this.starshipRepository.clear();

        const film: Starship = this.starshipRepository.create({
          id: data.url.match(/\/(\d+)\/?$/)[1],
          data: JSON.stringify(data),
        });

        return this.starshipRepository.save(film);
      } catch (error) {
        console.log(error);
      }
    }

    return starship;
  }
}
