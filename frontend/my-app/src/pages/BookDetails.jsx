import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import BookInfo from '../components/books/BookInfo'; // Simple display component for book details
import ReviewList from '../components/reviews/ReviewList'; // List reviews with edit/delete buttons
import ReviewForm from '../components/reviews/ReviewForm';
import RatingChart from '../components/reviews/RatingChart';
import RatingStars from '../components/reviews/RatingStars';

const BookDetails = () => {
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);

  const { data: book } = useQuery({
    queryKey: ['book', id],
    queryFn: () => axios.get(`http://localhost:5000/api/books/${id}`).then(res => res.data),
  });

  const { data: { reviews = [], avgRating = 0 } = {} } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => axios.get(`http://localhost:5000/api/reviews/book/${id}`).then(res => res.data),
  });

  if (!book) return <div>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <BookInfo book={book} />
      <div className="flex items-center justify-between">
        <RatingStars value={avgRating} />
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Review
        </button>
      </div>
      {reviews.length > 0 && <RatingChart reviews={reviews} />}
      <ReviewList reviews={reviews} bookId={id} />
      <ReviewForm bookId={id} isOpen={showForm} onClose={() => setShowForm(false)} />
    </motion.div>
  );
};

export default BookDetails;