import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';

import { PokemonModule } from './pokemon/pokemon.module'; // Importa PokemonModule aquí
import { PokemonService } from './pokemon/pokemon.service';
import { PokemonController } from './pokemon/pokemon.controller';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'), // Conexión a MongoDB

    PokemonModule,  // Importa PokemonModule
    HttpModule, SeedModule,
  ],

})
export class AppModule {}
