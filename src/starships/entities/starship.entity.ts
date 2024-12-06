import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, Exclusion, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Starship {
  @Field()
  @PrimaryColumn()
  id: number;

  @HideField()
  @Column('text')
  data: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;
}
