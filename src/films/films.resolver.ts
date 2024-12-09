import { Resolver, Query, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { FilmsService } from './films.service';
import { Film } from './entities/film.entity';
import GraphQLJSON from 'graphql-type-json';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { Repository } from 'typeorm';
import { PaginationFields } from '../utils/pagination';

@Resolver(() => Film)
export class FilmsResolver {
  private people: People[] = [];

  constructor(
    private readonly filmsService: FilmsService,
    @InjectRepository(People) private readonly peopleRepository: Repository<People>,
  ) {
  }

  @Query(() => [Film], { name: 'films' })
  async findAll(@Args() paginationFields: PaginationFields) {
    const { page, limit } = paginationFields;

    this.people = await this.peopleRepository.find();
    return this.filmsService.findAll(page, limit);
  }

  @Query(() => Film, { name: 'film' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.filmsService.findOne(id);
  }

  @ResolveField(() => GraphQLJSON)
  openingCrawlWordsCount(@Parent() film: Film) {
    let str = film.openingCrawl.toLowerCase().replace(/[^\w\s]+/gm, '');
    str = str.replace(/[\r\n|\n|\r]+/gm, ' ');
    const words = str.split(/\s+/);

    const countOfUniqueWords = {};
    for (const word of words) {
      countOfUniqueWords[word] = (countOfUniqueWords[word] || 0) + 1;
    }

    return countOfUniqueWords;
  }

  @ResolveField(() => GraphQLJSON)
  async peopleNamesCountAppearingInOpeningCrawl(@Parent() film: Film) {
    const peopleNames = {};
    for (const { name } of this.people) {
      const regex = new RegExp(name, 'gi');
      const matches = film.openingCrawl.replace(/[\r\n|\n|\r]+/gm, ' ').match(regex);

      if (matches) {
        peopleNames[name] = matches.length;
      }
    }

    return peopleNames;
  }
}
