import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { StarshipsService } from './starships.service';
import { Starship } from './entities/starship.entity';
import { CreateStarshipInput } from './dto/create-starship.input';
import { UpdateStarshipInput } from './dto/update-starship.input';
import GraphQLJSON from 'graphql-type-json';
import { Film } from '../films/entities/film.entity';

@Resolver(() => Starship)
export class StarshipsResolver {
  constructor(private readonly starshipsService: StarshipsService) {}

  @Mutation(() => Starship)
  createStarship(@Args('createStarshipInput') createStarshipInput: CreateStarshipInput) {
    return this.starshipsService.create(createStarshipInput);
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
