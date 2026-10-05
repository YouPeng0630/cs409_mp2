export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
}

export interface PokemonGalleryItem {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  image: string;
  types: string[];
  abilities: string[];
}
