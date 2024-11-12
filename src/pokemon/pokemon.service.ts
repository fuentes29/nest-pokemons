import { BadRequestException, ConflictException, HttpCode, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { error } from 'console';
import { HttpStatusCode } from 'axios';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
     this.handleExceptions(error);
      console.error(error);
      throw new InternalServerErrorException("Can't create Pokemon - check server logs");
    }
  }

  async findOne(term: string) {
    let pokemon: Pokemon;


    if (!isNaN(Number(term)) && term.trim() !== "") {
      pokemon = await this.pokemonModel.findOne({ no: Number(term) });
    }

  
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }


    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name, or no "${term}" not found`);
    }

    return pokemon;
  }



  async update(term: string, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon> {
   
    if (!isValidObjectId(term)) {
      throw new BadRequestException(`The id "${term}" is not a valid ObjectId`);
    }

    if (updatePokemonDto.no) {
      
      const existingPok = await this.pokemonModel.findOne({ no: updatePokemonDto.no });
  
      if (existingPok && existingPok.toString() !== term) {
        throw new BadRequestException(`The number "no" ${updatePokemonDto.no} is already taken by another Pokémon`);
      }
    }
   
    const pokemon = await this.pokemonModel.findByIdAndUpdate(term, updatePokemonDto, {
      new: true, 
    });


    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id "${term}" not found`);
    }

    return pokemon;
  }

  async deletePokemon( term: string ): Promise<Pokemon> {

    const delpoke =  await this.pokemonModel.findByIdAndDelete(term);

    if(!delpoke){
      throw new NotFoundException(`this id ${term} not found in BD `)
    
    }
    return delpoke;
  }

  private handleExceptions(error: any){
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists in BD: ${JSON.stringify(error.keyValue)}`);
    }

   
  }
  
}