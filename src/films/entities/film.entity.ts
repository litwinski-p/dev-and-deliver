import { ObjectType, Field } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { CacheType } from '../../utils/helpers';

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
