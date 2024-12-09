import { HideField, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { CacheType } from '../../utils/helpers';

@ObjectType()
@Entity()
export class Starship {
  @PrimaryColumn()
  id: number;

  @HideField()
  @Column('text')
  data: string;

  @Column({ type: 'enum', enum: CacheType, default: CacheType.ALL })
  cacheType: CacheType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;
}
