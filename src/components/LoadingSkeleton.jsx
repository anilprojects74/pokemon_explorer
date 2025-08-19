const LoadingSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="skeleton h-32 w-full rounded mb-4"></div>
              <div className="skeleton h-6 w-3/4 rounded mb-2"></div>
              <div className="skeleton h-4 w-1/2 rounded"></div>
          </div>
      ))}
  </div>
);

export default LoadingSkeleton