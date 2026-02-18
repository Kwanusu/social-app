import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border ${
        type === 'success' 
          ? 'bg-white dark:bg-gray-800 border-green-100 dark:border-green-900/30 text-gray-900 dark:text-white' 
          : 'bg-red-50 dark:bg-red-900 border-red-100 dark:border-red-800 text-red-600 dark:text-red-100'
      }`}>
        <CheckCircle className="text-green-500" size={20} />
        <span className="text-sm font-semibold">{message}</span>
        <button onClick={onClose} className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;

