import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Starship {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
