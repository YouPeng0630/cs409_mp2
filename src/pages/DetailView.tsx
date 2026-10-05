import styles from "./DetailView.module.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import type { PokemonDetail } from "../types/pokemon";

function DetailView() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setPokemon(null);

        const response = await api.get(`/pokemon/${id}`);

        const detail: PokemonDetail = {
          id: response.data.id,
          name: response.data.name,
          height: response.data.height,
          weight: response.data.weight,
          image:
            response.data.sprites.other["official-artwork"].front_default,
          types: response.data.types.map(
            (typeInfo: { type: { name: string } }) => typeInfo.type.name
          ),
          abilities: response.data.abilities.map(
            (abilityInfo: { ability: { name: string } }) =>
              abilityInfo.ability.name
          ),
        };

        if (active) {
          setPokemon(detail);
        }
      } catch (error) {
        if (active) {
          console.error("Failed to fetch Pokémon details:", error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchPokemon();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <p>Loading Pokémon...</p>;
  }

  if (!pokemon) {
    return <p>Pokémon not found.</p>;
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{pokemon.name}</h1>

        <p className={styles.id}>#{pokemon.id}</p>

        <img
          className={styles.image}
          src={pokemon.image}
          alt={pokemon.name}
        />

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Type</span>
            <span className={styles.value}>
              {pokemon.types.join(", ")}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Height</span>
            <span className={styles.value}>
              {pokemon.height}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Weight</span>
            <span className={styles.value}>
              {pokemon.weight}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Abilities</span>
            <span className={styles.value}>
              {pokemon.abilities.join(", ")}
            </span>
          </div>
        </div>

        <div className={styles.navigation}>
          {pokemon.id > 1 ? (
            <Link to={`/pokemon/${pokemon.id - 1}`}>
              ← Previous
            </Link>
          ) : (
            <span className={styles.navigationSpacer} />
          )}

          {pokemon.id < 150 ? (
            <Link to={`/pokemon/${pokemon.id + 1}`}>
              Next →
            </Link>
          ) : (
            <span className={styles.navigationSpacer} />
          )}
        </div>
      </div>
    </main>
  );
}

export default DetailView;
