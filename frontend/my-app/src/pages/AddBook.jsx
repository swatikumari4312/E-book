import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AddBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: book } = useQuery({
    queryKey: ['book', id],
    queryFn: () => axios.get(`http://localhost:5000/api/books/${id}`).then(res => res.data),
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? axios.put(`http://localhost:5000/api/books/${id}`, data) : axios.post('http://localhost:5000/api/books', data),
    onSuccess: () => {
      toast.success(isEdit ? 'Book updated!' : 'Book added!');
      navigate('/');
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: book });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Book' : 'Add Book'}</h2>
      <input {...register('title', { required: 'Title required' })} placeholder="Title" className="w-full p-3 mb-4 border rounded" />
      {errors.title && <p className="text-red-500 mb-2">{errors.title.message}</p>}
      <input {...register('author', { required: 'Author required' })} placeholder="Author" className="w-full p-3 mb-4 border rounded" />
      {errors.author && <p className="text-red-500 mb-2">{errors.author.message}</p>}
      <textarea {...register('description', { required: 'Description required' })} placeholder="Description" className="w-full p-3 mb-4 border rounded h-24" />
      {errors.description && <p className="text-red-500 mb-2">{errors.description.message}</p>}
      <input {...register('genre', { required: 'Genre required' })} placeholder="Genre" className="w-full p-3 mb-4 border rounded" />
      {errors.genre && <p className="text-red-500 mb-2">{errors.genre.message}</p>}
      <input {...register('year', { required: 'Year required', min: 1900, max: 2025 })} type="number" placeholder="Published Year" className="w-full p-3 mb-6 border rounded" />
      {errors.year && <p className="text-red-500 mb-2">{errors.year.message}</p>}
      <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
    </motion.form>
  );
};

export default AddBook;