import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { StarshipsService } from './starships.service';
import { Starship } from './entities/starship.entity';
import GraphQLJSON from 'graphql-type-json';

@Resolver(() => Starship)
export class StarshipsResolver {
  constructor(private readonly starshipsService: StarshipsService) {
  }

  @Query(() => [Starship], { name: 'starships' })
  findAll() {
    return this.starshipsService.findAll();
  }

  @ResolveField(() => GraphQLJSON)
  starshipData(@Parent() starship: Starship) {
    return JSON.parse(starship.data);
  }

  // @Query(() => Starship, { name: 'starship' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.starshipsService.findOne(id);
  // }
}
