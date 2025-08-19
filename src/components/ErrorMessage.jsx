const ErrorMessage = ({ message, onRetry }) => (
  <div className="text-center py-12">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors focus-ring"
      >
          Try Again
      </button>
  </div>
);

export default ErrorMessage