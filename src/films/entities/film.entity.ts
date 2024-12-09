import { ObjectType, Field } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

export enum CacheType {
  SINGLE = 'single',
  ALL = 'all'
}

@ObjectType()
@Entity()
export class Film {
  @PrimaryColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  openingCrawl: string;

  @Field()
  @Column()
  director: string;

  @Field()
  @Column()
  producer: string;

  @Column({ type: 'enum', enum: CacheType, default: CacheType.ALL })
  cacheType: CacheType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

}
