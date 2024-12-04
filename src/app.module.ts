import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsModule } from './films/films.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql-db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'swapi',
      entities: [],
      synchronize: true,
    }),
    FilmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
