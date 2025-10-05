import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook';
import PrivateRoute from './components/auth/PrivateRoute';
import './index.css'
import './App.css'
// import AddSampleBook from './pages/AddsampleBook';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Header />
            <main className="container mx-auto p-4">
              <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<BookList />} />
                <Route path="/search" element={<BookList />} />
                {/* <Route path="/add-book" element={<AddSampleBook/>} /> */}
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/add-book" element={<PrivateRoute><AddBook /></PrivateRoute>} />
                <Route path="/edit-book/:id" element={<PrivateRoute><AddBook /></PrivateRoute>} />
              </Routes>
            </main>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;