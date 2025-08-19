import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { pokemonApi } from "../services/pokemonApi";
import ErrorMessage from "./ErrorMessage";

const PokemonDetail = ({ pokemonId, onClose, isFavorite, onToggleFavorite }) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useLocalStorage('pokemon-notes', {});

  useEffect(() => {
      const fetchPokemon = async () => {
          try {
              setLoading(true);
              setError(null);
              const data = await pokemonApi.fetchPokemonById(pokemonId);
              setPokemon(data);
              setNote(notes[pokemonId] || '');
          } catch (err) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };

      fetchPokemon();
  }, [pokemonId, notes]);

  const handleSaveNote = () => {
      setNotes(prev => ({
          ...prev,
          [pokemonId]: note
      }));
  };

  const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
          onClose();
      }
  };

  useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
      return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-center mt-4 text-gray-600 dark:text-gray-400">Loading Pokémon details...</p>
              </div>
          </div>
      );
  }

  if (error) {
      return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4">
                  <ErrorMessage message={error} onRetry={() => window.location.reload()} />
                  <button
                      onClick={onClose}
                      className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                      Close
                  </button>
              </div>
          </div>
      );
  }

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {capitalizeFirst(pokemon.name)} #{pokemon.id.toString().padStart(3, '0')}
                  </h2>
                  <div className="flex items-center gap-4">
                      <button
                          onClick={() => onToggleFavorite(pokemon.id)}
                          className="text-2xl transition-transform hover:scale-110 focus-ring rounded"
                          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                          {isFavorite ? '❤️' : '🤍'}
                      </button>
                      <button
                          onClick={onClose}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl focus-ring rounded"
                          aria-label="Close"
                      >
                          ✕
                      </button>
                  </div>
              </div>

              <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="text-center">
                          <img
                              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                              alt={pokemon.name}
                              className="w-64 h-64 mx-auto object-contain"
                          />
                          
                          <div className="flex flex-wrap gap-2 justify-center mt-4">
                              {pokemon.types.map((type) => (
                                  <span
                                      key={type.type.name}
                                      className="px-4 py-2 rounded-full text-white text-sm font-medium bg-blue-500"
                                  >
                                      {capitalizeFirst(type.type.name)}
                                  </span>
                              ))}
                          </div>
                      </div>

                      <div className="space-y-6">
                          <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Stats</h3>
                              <div className="space-y-2">
                                  {pokemon.stats.map((stat) => (
                                      <div key={stat.stat.name} className="flex items-center">
                                          <span className="w-24 text-sm text-gray-600 dark:text-gray-400 capitalize">
                                              {stat.stat.name.replace('-', ' ')}:
                                          </span>
                                          <div className="flex-1 ml-4">
                                              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                  <div
                                                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                      style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                                                  ></div>
                                              </div>
                                          </div>
                                          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                                              {stat.base_stat}
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Details</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                      <span className="text-gray-600 dark:text-gray-400">Height:</span>
                                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                          {pokemon.height / 10} m
                                      </span>
                                  </div>
                                  <div>
                                      <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                          {pokemon.weight / 10} kg
                                      </span>
                                  </div>
                                  <div>
                                      <span className="text-gray-600 dark:text-gray-400">Base Experience:</span>
                                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                          {pokemon.base_experience}
                                      </span>
                                  </div>
                              </div>
                          </div>

                          <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Abilities</h3>
                              <div className="flex flex-wrap gap-2">
                                  {pokemon.abilities.map((ability) => (
                                      <span
                                          key={ability.ability.name}
                                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                                      >
                                          {capitalizeFirst(ability.ability.name.replace('-', ' '))}
                                          {ability.is_hidden && ' (Hidden)'}
                                      </span>
                                  ))}
                              </div>
                          </div>

                          <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Personal Notes</h3>
                              <div className="space-y-3">
                                  <textarea
                                      value={note}
                                      onChange={(e) => setNote(e.target.value)}
                                      placeholder="Add your personal notes about this Pokémon..."
                                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                      rows={3}
                                  />
                                  <button
                                      onClick={handleSaveNote}
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors focus-ring"
                                  >
                                      Save Note
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default PokemonDetail