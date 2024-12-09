import { Resolver, Query, ResolveField, Parent, Args, Int } from '@nestjs/graphql';
import { StarshipsService } from './starships.service';
import { Starship } from './entities/starship.entity';
import GraphQLJSON from 'graphql-type-json';
import { PaginationFields } from '../utils/pagination';

@Resolver(() => Starship)
export class StarshipsResolver {
  constructor(private readonly starshipsService: StarshipsService) {
  }

  @Query(() => [Starship], { name: 'starships' })
  findAll(@Args() paginationFields: PaginationFields) {
    const { page, limit } = paginationFields;
    return this.starshipsService.findAll(page, limit);
  }

  @Query(() => Starship, { name: 'starship' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.starshipsService.findOne(id);
  }

  @ResolveField(() => GraphQLJSON)
  starshipData(@Parent() starship: Starship) {
    return JSON.parse(starship.data);
  }
}
