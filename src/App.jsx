import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { pokemonApi } from "./services/pokemonApi";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useUrlState } from "./hooks/useUrlState";

import SearchAndFilters from "./components/SearchAndFilters";
import PokemonCard from "./components/PokemonCard";
import PokemonDetail from "./components/PokemonDetail";
import Pagination from "./components/Pagination";
import ThemeToggle from "./components/ThemeToggle";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ErrorMessage from "./components/ErrorMessage";
import EmptyState from "./components/EmptyState";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const PokemonExplorer = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [types, setTypes] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [favorites, setFavorites] = useLocalStorage('pokemon-favorites', []);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('dark-mode', false);
  const [urlParams, updateUrl] = useUrlState();
  const [totalCount, setTotalCount] = useState(0);
  const abortControllerRef = useRef(null);

  const itemsPerPage = 20;

  // Debounced search function
  const debouncedSearch = useCallback(
      debounce((searchTerm) => {
          updateUrl({ search: searchTerm, page: 1 });
      }, 300),
      [updateUrl]
  );

  // Fetch Pokemon types on mount
  useEffect(() => {
      const fetchTypes = async () => {
          try {
              const typesData = await pokemonApi.fetchPokemonTypes();
              setTypes(typesData);
          } catch (err) {
              console.error('Failed to fetch types:', err);
          }
      };
      fetchTypes();
  }, []);

  useEffect(() => {
      const fetchPokemon = async () => {
          try {
              if (abortControllerRef.current) {
                  abortControllerRef?.current?.abort();
              }

              setLoading(true);
              setError(null);

              const offset = (urlParams.page - 1) * itemsPerPage;
              const response = await pokemonApi.fetchPokemonList(offset, itemsPerPage);
              abortControllerRef.current = { abort: response?.abort };

              setPokemon(response.results);
              setTotalCount(response.count);
          } catch (err) {
              if (err.name !== 'AbortError') {
                  setError(err.message);
              }
          } finally {
              setLoading(false);
          }
      };

      fetchPokemon();

      return () => {
          if (abortControllerRef.current && abortControllerRef?.current?.abort != null ) {
              abortControllerRef?.current?.abort();
          }
      };
  }, [urlParams.page]);

  // Apply dark mode
  useEffect(() => {
      if (isDarkMode) {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, [isDarkMode]);

  // Filter and sort Pokemon
  const filteredAndSortedPokemon = useMemo(() => {
      let filtered = pokemon;

      // Apply search filter
      if (urlParams.search) {
          filtered = filtered.filter(p => 
              p.name.toLowerCase().includes(urlParams.search.toLowerCase()) ||
              p.id.toString().includes(urlParams.search)
          );
      }

      // Apply type filter
      if (urlParams.type) {
          filtered = filtered.filter(p => 
              p.types.some(type => type.type.name === urlParams.type)
          );
      }

      // Apply favorites filter
      if (urlParams.view === 'favorites') {
          filtered = filtered.filter(p => favorites.includes(p.id));
      }

      // Apply sorting
      filtered.sort((a, b) => {
          switch (urlParams.sort) {
              case 'name':
                  return a.name.localeCompare(b.name);
              case 'height':
                  return b.height - a.height;
              case 'weight':
                  return b.weight - a.weight;
              default:
                  return a.id - b.id;
          }
      });

      return filtered;
  }, [pokemon, urlParams, favorites]);

  const handleToggleFavorite = (pokemonId) => {
      setFavorites(prev => 
          prev.includes(pokemonId)
              ? prev.filter(id => id !== pokemonId)
              : [...prev, pokemonId]
      );
  };

  const handleRetry = () => {
      window.location.reload();
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
      <div className={`min-h-screen transition-colors duration-200 ${
          isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
      }`}>
          <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                  <div>
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                          Pokémon Explorer
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400">
                          Discover and explore your favorite Pokémon
                      </p>
                  </div>
                  <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
              </div>

              {/* Search and Filters */}
              <SearchAndFilters
                  searchTerm={urlParams.search}
                  onSearchChange={debouncedSearch}
                  selectedType={urlParams.type}
                  onTypeChange={(type) => updateUrl({ type, page: 1 })}
                  sortBy={urlParams.sort}
                  onSortChange={(sort) => updateUrl({ sort })}
                  viewFilter={urlParams.view}
                  onViewFilterChange={(view) => updateUrl({ view, page: 1 })}
                  types={types}
                  favoriteCount={favorites.length}
              />

              {/* Content */}
              {loading ? (
                  <LoadingSkeleton />
              ) : error ? (
                  <ErrorMessage message={error} onRetry={handleRetry} />
              ) : filteredAndSortedPokemon.length === 0 ? (
                  <EmptyState 
                      message={
                          urlParams.view === 'favorites' 
                              ? "You haven't added any favorites yet. Click the heart icon on any Pokémon to add them!"
                              : urlParams.search || urlParams.type
                              ? "Try adjusting your search or filters to find more Pokémon."
                              : "No Pokémon found."
                      }
                      icon={urlParams.view === 'favorites' ? '❤️' : '🔍'}
                  />
              ) : (
                  <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filteredAndSortedPokemon.map((p) => (
                              <PokemonCard
                                  key={p.id}
                                  pokemon={p}
                                  isFavorite={favorites.includes(p.id)}
                                  onToggleFavorite={handleToggleFavorite}
                                  onViewDetails={setSelectedPokemon}
                              />
                          ))}
                      </div>

                      {/* Pagination */}
                      {!urlParams.search && !urlParams.type && urlParams.view === 'all' && (
                          <Pagination
                              currentPage={urlParams.page}
                              totalPages={totalPages}
                              onPageChange={(page) => updateUrl({ page })}
                          />
                      )}
                  </>
              )}

              {/* Pokemon Detail Modal */}
              {selectedPokemon && (
                  <PokemonDetail
                      pokemonId={selectedPokemon}
                      onClose={() => setSelectedPokemon(null)}
                      isFavorite={favorites.includes(selectedPokemon)}
                      onToggleFavorite={handleToggleFavorite}
                  />
              )}
          </div>
      </div>
  );
};

function App() {
  return(<PokemonExplorer/>)
}

export default App;
