import { useState, useEffect, useMemo, useRef, useCallback } from "react";

const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedType, 
  onTypeChange, 
  sortBy, 
  onSortChange,
  viewFilter,
  onViewFilterChange,
  types,
  favoriteCount 
}) => {

  const searchInputRef = useRef(null);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
      const handleKeyDown = (e) => {
          if (e.ctrlKey && e.key === 'k') {
              e.preventDefault();
              searchInputRef.current?.focus();
          }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                  <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search Pokémon... (Ctrl+K)"
                      value={localSearch}
                      onChange={(e) => {
                        setLocalSearch(e.target.value); 
                        onSearchChange(e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      aria-label="Search Pokémon"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔍</span>
                  </div>
              </div>

              <select
                  value={selectedType}
                  onChange={(e) => onTypeChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  aria-label="Filter by type"
              >
                  <option value="">All Types</option>
                  {types.map((type) => (
                      <option key={type.name} value={type.name}>
                          {capitalizeFirst(type.name)}
                      </option>
                  ))}
              </select>

              <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  aria-label="Sort by"
              >
                  <option value="id">Sort by ID</option>
                  <option value="name">Sort by Name</option>
                  <option value="height">Sort by Height</option>
                  <option value="weight">Sort by Weight</option>
              </select>

              <select
                  value={viewFilter}
                  onChange={(e) => onViewFilterChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  aria-label="Filter view"
              >
                  <option value="all">All Pokémon</option>
                  <option value="favorites">
                      Favorites ({favoriteCount})
                  </option>
              </select>
          </div>
      </div>
  );
};

export default SearchAndFilters