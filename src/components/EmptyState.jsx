const EmptyState = ({ message, icon = "🔍" }) => (
  <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Pokémon Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
  </div>
);

export default EmptyState

