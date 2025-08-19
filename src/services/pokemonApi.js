export const pokemonApi = {
  async fetchPokemonList(offset = 0, limit = 20, signal) {
    const controller = new AbortController();

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
      { signal: controller.signal }
    );
    if (!response.ok) throw new Error("Failed to fetch Pokemon list");
    const data = await response.json();

    const detailedPokemon = await Promise.all(
      data.results.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url, { signal }); // 👈 also cancelable
        if (!detailResponse.ok) throw new Error(`Failed to fetch ${pokemon.name}`);
        return detailResponse.json();
      })
    );

    return { results: detailedPokemon, count: data.count, abort: () => controller.abort() };
  },

  async fetchPokemonById(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, 
    );
    if (!response.ok) throw new Error("Pokemon not found");
    return response.json();
  },

  async fetchPokemonTypes() {
    const controller = new AbortController();
    const response = await fetch("https://pokeapi.co/api/v2/type", { signal: controller.signal });
    if (!response.ok) throw new Error("Failed to fetch types");
    const data = await response.json();
    return data.results;
  },
};
