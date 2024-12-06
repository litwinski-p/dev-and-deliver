import { Resolver, Query, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { FilmsService } from './films.service';
import { Film } from './entities/film.entity';
import GraphQLJSON from 'graphql-type-json';
import axios from 'axios';

@Resolver(() => Film)
export class FilmsResolver {
  constructor(private readonly filmsService: FilmsService) {
  }

  @Query(() => [Film], { name: 'films' })
  findAll() {
    return this.filmsService.findAll();
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
  async peopleCountAppearingInOpeningCrawl(@Parent() film: Film) {
    const peopleUrls = JSON.parse(film.people);
    const peopleNames = {};
    for (const url of peopleUrls) {
      try {
        const { data: { name } } = await axios.get(url);

        const regex = new RegExp(name, 'gi');
        const matches = film.openingCrawl.replace(/[\r\n|\n|\r]+/gm, ' ').match(regex);

        if (matches) {
          peopleNames[name] = matches.length;
        }
      } catch (error) {
        console.log(error);
      }
    }

    return peopleNames;
  }
}
