import { useState, useEffect, useMemo, useRef, useCallback } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
          range.push(i);
      }

      if (currentPage - delta > 2) {
          rangeWithDots.push(1, '...');
      } else {
          rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
          rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1) {
          rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
  };

  return (
      <div className="flex justify-center items-center space-x-2 mt-8">
          <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
              aria-label="Previous page"
          >
              ←
          </button>

          {getVisiblePages().map((page, index) => (
              <button
                  key={index}
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                  disabled={page === '...'}
                  className={`px-3 py-2 rounded-lg border focus-ring ${
                      page === currentPage
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${page === '...' ? 'cursor-default' : ''}`}
              >
                  {page}
              </button>
          ))}

          <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
              aria-label="Next page"
          >
              →
          </button>
      </div>
  );
};

export default Pagination