import { motion } from 'framer-motion';
import RatingStars from '../reviews/RatingStars';

const BookInfo = ({ book, avgRating }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6"
  >
    <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{book.title}</h1>
    <p className="text-xl mb-2 text-gray-600 dark:text-gray-300">By {book.addedBy?.name}</p>
    <div className="flex items-center mb-4">
      <span className="text-sm bg-gray-200 px-2 py-1 rounded mr-2">{book.genre}</span>
      <span className="text-sm text-gray-500">{book.year}</span>
    </div>
    <p className="text-gray-700 dark:text-gray-200 mb-4">{book.description}</p>
    <RatingStars value={avgRating} />
  </motion.div>
);

export default BookInfo;