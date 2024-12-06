import { CreateStarshipInput } from './create-starship.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStarshipInput extends PartialType(CreateStarshipInput) {
  @Field(() => Int)
  id: number;
}
