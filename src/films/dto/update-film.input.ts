import { CreateFilmInput } from './create-film.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFilmInput extends PartialType(CreateFilmInput) {
  @Field(() => Int)
  id: number;
}
