import { useState } from 'react';
import { motion } from 'framer-motion';
import ReviewForm from './ReviewForm';
import { TrashIcon, PencilIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const ReviewItem = ({ review, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`http://localhost:5000/api/reviews/${review._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews']);
      toast.success('Review deleted');
    },
  });

  const isOwner = review.userId._id === currentUserId;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-semibold text-gray-800 dark:text-white">{review.userId.name}</p>
          <p className="text-gray-600 dark:text-gray-300">{review.reviewText}</p>
        </div>
        <div className="ml-4">
          <span className="text-yellow-400">★ {review.rating}</span>
          {isOwner && (
            <div className="flex space-x-2 mt-2">
              <button onClick={() => setIsEditing(true)} className="p-1 text-blue-500">
                <PencilIcon className="h-4 w-4" />
              </button>
              <button onClick={() => deleteMutation.mutate()} className="p-1 text-red-500">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      {isEditing && <ReviewForm initialData={review} isOpen={isEditing} onClose={() => setIsEditing(false)} />}
    </motion.div>
  );
};

const ReviewList = ({ reviews, bookId, userId }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Reviews</h2>
    {reviews.map((review) => (
      <ReviewItem key={review._id} review={review} currentUserId={userId} />
    ))}
  </div>
);

export default ReviewList;