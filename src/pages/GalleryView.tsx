import styles from "./GalleryView.module.css";
import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import type { PokemonGalleryItem } from "../types/pokemon";

const pokemonTypes = [
  "all",
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

function GalleryView() {
  const [pokemon, setPokemon] = useState<PokemonGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const listResponse = await api.get("/pokemon?limit=150");

        const detailRequests = listResponse.data.results.map(
          (_item: { name: string; url: string }, index: number) =>
            api.get(`/pokemon/${index + 1}`)
        );

        const detailResponses = await Promise.all(detailRequests);

        const galleryPokemon: PokemonGalleryItem[] =
          detailResponses.map((response) => ({
            id: response.data.id,
            name: response.data.name,
            image:
              response.data.sprites.other["official-artwork"]
                .front_default,
            types: response.data.types.map(
              (typeInfo: { type: { name: string } }) =>
                typeInfo.type.name
            ),
          }));

        setPokemon(galleryPokemon);
      } catch (error) {
        console.error("Failed to fetch Pokémon gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (loading) {
    return <p>Loading gallery...</p>;
  }

  const filteredPokemon =
    selectedType === "all"
      ? pokemon
      : pokemon.filter((item) => item.types.includes(selectedType));

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pokémon Gallery</h1>

        <div className={styles.filter}>
          <label htmlFor="type-filter">Filter by Type</label>

          <select
            id="type-filter"
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
          >
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.gallery}>
        {filteredPokemon.map((item) => (
          <div key={item.id} className={styles.card}>
            <Link to={`/pokemon/${item.id}`}>
              <img
                className={styles.image}
                src={item.image}
                alt={item.name}
              />

              <h2 className={styles.name}>{item.name}</h2>
            </Link>

            <p className={styles.types}>
              {item.types.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default GalleryView;
