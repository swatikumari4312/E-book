import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import RatingStars from './RatingStars';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const ReviewForm = ({ bookId, isOpen, onClose, initialData = {} }) => {
  const [rating, setRating] = useState(initialData.rating || 0);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ 
    defaultValues: { reviewText: initialData.reviewText || '' } 
  });

  const mutation = useMutation({
    mutationFn: (data) => axios.post('http://localhost:5000/api/reviews', { ...data, bookId, rating }),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', bookId]);
      toast.success('Review added!');
      onClose();
      reset();
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Add Review</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RatingStars value={rating} onChange={setRating} isEditable />
            <textarea
              {...register('reviewText', { required: 'Review text is required' })}
              placeholder="Share your thoughts..."
              className="w-full p-3 mt-4 border rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              aria-invalid={errors.reviewText ? 'true' : 'false'}
            />
            {errors.reviewText && <p className="text-red-500 text-sm mt-1">{errors.reviewText.message}</p>}
            <div className="flex justify-end space-x-3 mt-6">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:underline">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Submit
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReviewForm;