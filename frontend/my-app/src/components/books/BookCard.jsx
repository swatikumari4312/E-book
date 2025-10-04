import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, StarIcon } from '@heroicons/react/outline';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BookCard = ({ book }) => {
  const { data: avgRating } = useQuery({
    queryKey: ['reviews', book._id],
    queryFn: () => axios.get(`http://localhost:5000/api/reviews/book/${book._id}`).then(res => res.data.avgRating),
  });

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      <Link to={`/book/${book._id}`}>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{book.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">By {book.addedBy?.name || 'Unknown'}</p>
          <p className="text-sm text-gray-500 mb-4">{book.genre} | {book.year}</p>
          <p className="text-gray-700 dark:text-gray-200 mb-4 line-clamp-3">{book.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium">{avgRating || 0}/5</span>
            </div>
            <button className="p-2 text-gray-400 hover:text-red-500">
              <HeartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;