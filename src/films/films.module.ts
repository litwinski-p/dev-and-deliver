import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResolver } from './films.resolver';

@Module({
  providers: [FilmsResolver, FilmsService],
})
export class FilmsModule {}
