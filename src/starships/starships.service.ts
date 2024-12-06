import { Injectable } from '@nestjs/common';
import { CreateStarshipInput } from './dto/create-starship.input';
import { UpdateStarshipInput } from './dto/update-starship.input';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Starship } from './entities/starship.entity';
import { Film } from '../films/entities/film.entity';

@Injectable()
export class StarshipsService {
  private readonly apiUrl = 'https://swapi.dev/api/starships';

  constructor(@InjectRepository(Starship) private readonly starshipRepository: Repository<Starship>) {
  }

  create(createStarshipInput: CreateStarshipInput) {
    return 'This action adds a new starship';
  }

  async findAll() {
    let starships = await this.starshipRepository.find();

    if (starships.length === 0) {
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
}
