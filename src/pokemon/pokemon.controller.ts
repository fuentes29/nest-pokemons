import { Controller, Post, Body, Get, Param, Patch, HttpCode, ValidationPipe, UsePipes, Delete } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';


@Controller('pokemon')  
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @HttpCode(200)
  @Get(':term')
   findOne(@Param('term') term: string){
    return this.pokemonService.findOne(term);

  }
  @HttpCode(200)
  @UsePipes(new ValidationPipe)
  @Post() 
  async create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }



  @HttpCode(200)
  @UsePipes(new ValidationPipe)
  @Patch(':term')
  updatePokemon(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(term, updatePokemonDto);
  
  }

  @HttpCode(200)
  @Delete(':term')
  deletePokemon(@Param('term') term: string){
    return this.pokemonService.deletePokemon(term);
    
  }

}
