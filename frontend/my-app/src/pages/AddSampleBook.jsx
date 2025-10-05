import axios from 'axios';

const AddSampleBook = () => {
  const handleAddBook = async () => {
    try {
      const token = localStorage.getItem('token'); // ensure user is logged in
      if (!token) {
        alert('You must log in first!');
        return;
      }

      // Generate 20 sample books
      const sampleBooks = Array.from({ length: 20 }).map((_, i) => ({
        title: `Sample Book ${i + 1}`,
        author: `Author ${i + 1}`,
        description: `This is the description for Sample Book ${i + 1}.`,
        genre: ['Fiction', 'Mystery', 'Biography', 'Sci-Fi'][i % 4], // Rotate genres
        year: 2000 + i, // Year from 2000 onwards
      }));

      // Add each book
      for (const book of sampleBooks) {
        await axios.post('${import.meta.env.VITE_API_URL}/api/books', book, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      alert('20 Sample Books Added Successfully!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Error adding books');
    }
  };

  return (
    <div>
      <button
        onClick={handleAddBook}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Add 20 Sample Books
      </button>
    </div>
  );
};

export default AddSampleBook;
