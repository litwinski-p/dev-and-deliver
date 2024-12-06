import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsResolver } from './starships.resolver';

@Module({
  providers: [StarshipsResolver, StarshipsService],
})
export class StarshipsModule {}
