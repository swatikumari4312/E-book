import { useState, useEffect } from 'react'; // ✅ include useEffect
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/books/BookCard';
import Pagination from '../components/common/Pagination';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const BookList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['books', page, searchQuery],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/books?page=${page}&search=${searchQuery}`)
        .then(res => res.data),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
    setPage(1);
    toast('Searching...');
  };

  if (isLoading) return <div className="text-center py-8">Loading books... 🔄</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading books. Try again!</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Discover Books</h1>
        <form onSubmit={handleSearch} className="flex w-full md:w-auto mt-4 md:mt-0">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="flex-1 p-3 border rounded-l-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.books?.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {data?.totalPages > 1 && (
        <Pagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </motion.div>
  );
};

export default BookList;
