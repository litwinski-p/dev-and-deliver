import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FilmsService } from './films.service';
import { Film } from './entities/film.entity';
import { CreateFilmInput } from './dto/create-film.input';
import { UpdateFilmInput } from './dto/update-film.input';

@Resolver(() => Film)
export class FilmsResolver {
  constructor(private readonly filmsService: FilmsService) {}

  @Mutation(() => Film)
  createFilm(@Args('createFilmInput') createFilmInput: CreateFilmInput) {
    return this.filmsService.create(createFilmInput);
  }

  @Query(() => [Film], { name: 'films' })
  findAll() {
    return this.filmsService.findAll();
  }

  @Query(() => Film, { name: 'film' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.filmsService.findOne(id);
  }

  @Mutation(() => Film)
  updateFilm(@Args('updateFilmInput') updateFilmInput: UpdateFilmInput) {
    return this.filmsService.update(updateFilmInput.id, updateFilmInput);
  }

  @Mutation(() => Film)
  removeFilm(@Args('id', { type: () => Int }) id: number) {
    return this.filmsService.remove(id);
  }
}
