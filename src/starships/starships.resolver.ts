import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StarshipsService } from './starships.service';
import { Starship } from './entities/starship.entity';
import { CreateStarshipInput } from './dto/create-starship.input';
import { UpdateStarshipInput } from './dto/update-starship.input';

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

  @Query(() => Starship, { name: 'starship' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.starshipsService.findOne(id);
  }

  @Mutation(() => Starship)
  updateStarship(@Args('updateStarshipInput') updateStarshipInput: UpdateStarshipInput) {
    return this.starshipsService.update(updateStarshipInput.id, updateStarshipInput);
  }

  @Mutation(() => Starship)
  removeStarship(@Args('id', { type: () => Int }) id: number) {
    return this.starshipsService.remove(id);
  }
}
