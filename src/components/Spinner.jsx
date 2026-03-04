
// src/components/Spinner.jsx
const Spinner = () => (
  <div className="flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]">
    <div className="relative">
      {/* Outer Ring */}
      <div className="w-12 h-12 border-4 border-blue-200 dark:border-gray-700 rounded-full"></div>
      {/* Spinning Ring */}
      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
      Loading content...
    </p>
  </div>
);

export default Spinner;
