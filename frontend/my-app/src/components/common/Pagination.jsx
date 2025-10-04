import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center mt-8 space-x-2">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <motion.button
        key={page}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(page)}
        className={`px-4 py-2 rounded-lg ${
          page === currentPage
            ? 'bg-indigo-600 text-white'
            : 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-600'
        }`}
      >
        {page}
      </motion.button>
    ))}
  </div>
);

export default Pagination;