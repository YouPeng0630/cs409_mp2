import styles from "./ListView.module.css";
import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import type { PokemonListItem } from "../types/pokemon";

function ListView() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "name">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await api.get("/pokemon?limit=150");

        const pokemonWithIds = response.data.results.map(
          (item: { name: string; url: string }) => {
            const parts = item.url.split("/").filter(Boolean);
            const id = Number(parts[parts.length - 1]);

            return {
              ...item,
              id,
            };
          }
        );

        setPokemon(pokemonWithIds);
      } catch (error) {
        console.error("Failed to fetch Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const filteredPokemon = pokemon.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "id") {
      comparison = a.id - b.id;
    } else {
      comparison = a.name.localeCompare(b.name);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Pokémon List</h1>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label htmlFor="search">Search</label>

          <input
            id="search"
            type="text"
            placeholder="Search Pokémon..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="sort">Sort by</label>

          <select
            id="sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as "id" | "name")
            }
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="order">Order</label>

          <select
            id="order"
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value as "asc" | "desc")
            }
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {sortedPokemon.length === 0 ? (
        <p className={styles.empty}>No Pokémon found.</p>
      ) : (
        <ul className={styles.list}>
          {sortedPokemon.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <Link to={`/pokemon/${item.id}`}>
                #{item.id} {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default ListView;
