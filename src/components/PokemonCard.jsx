import { useState, useEffect, useMemo, useRef, useCallback } from "react";

const PokemonCard = ({ pokemon, isFavorite, onToggleFavorite, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const handleFavoriteClick = (e) => {
      e.stopPropagation();
      setIsHeartAnimating(true);
      onToggleFavorite(pokemon.id);
      setTimeout(() => setIsHeartAnimating(false), 300);
  };

  const primaryType = pokemon.types[0]?.type.name;
  const typeColors = {
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      grass: 'bg-green-500',
      electric: 'bg-yellow-500',
      psychic: 'bg-purple-500',
      ice: 'bg-blue-300',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-800',
      fairy: 'bg-pink-400',
      fighting: 'bg-red-700',
      poison: 'bg-purple-600',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      bug: 'bg-green-400',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-800',
      steel: 'bg-gray-500',
      normal: 'bg-gray-400'
  };

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
      <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
          onClick={() => onViewDetails(pokemon.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onViewDetails(pokemon.id)}
      >
          <div className="relative p-6">
              <button
                  onClick={handleFavoriteClick}
                  className={`absolute top-2 right-2 text-2xl transition-transform focus-ring rounded ${
                      isHeartAnimating ? 'heart-bounce' : ''
                  }`}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                  {isFavorite ? '❤️' : '🤍'}
              </button>
              
              <div className="text-center">
                  {!imageError ? (
                      <img
                          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                          alt={pokemon.name}
                          className="w-32 h-32 mx-auto mb-4 object-contain"
                          onError={() => setImageError(true)}
                      />
                  ) : (
                      <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-4xl">
                          🎯
                      </div>
                  )}
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {capitalizeFirst(pokemon.name)}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      #{pokemon.id.toString().padStart(3, '0')}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                      {pokemon.types.map((type) => (
                          <span
                              key={type.type.name}
                              className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                                  typeColors[type.type.name] || 'bg-gray-500'
                              }`}
                          >
                              {capitalizeFirst(type.type.name)}
                          </span>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );
};

export default PokemonCard