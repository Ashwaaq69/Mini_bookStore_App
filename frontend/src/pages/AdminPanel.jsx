import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Edit, Trash2, BookOpen, Users, BarChart3 } from 'lucide-react';

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_date: '',
    available: true
  });
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) fetchBooks();
  }, [isAdmin]);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook.id}`, formData);
      } else {
        await api.post('/books', formData);
      }
      setShowModal(false);
      setEditingBook(null);
      setFormData({ title: '', author: '', published_date: '', available: true });
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      published_date: book.published_date || '',
      available: book.available
    });
    setShowModal(true);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${bookId}`);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage books and users</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all"
          >
            <Plus className="h-5 w-5 mr-2" /> Add Book
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-xl transition">
            <BookOpen className="h-10 w-10 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{books.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-xl transition">
            <Users className="h-10 w-10 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Available Books</p>
              <p className="text-2xl font-bold text-gray-900">{books.filter(b => b.available).length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 hover:shadow-xl transition">
            <BarChart3 className="h-10 w-10 text-red-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Unavailable</p>
              <p className="text-2xl font-bold text-gray-900">{books.filter(b => !b.available).length}</p>
            </div>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-indigo-50">
            <h3 className="text-lg font-medium text-gray-900">Books Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-100">
                <tr>
                  {['Title', 'Author', 'Published Date', 'Status', 'Actions'].map((th) => (
                    <th key={th} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-indigo-50 transition">
                    <td className="px-6 py-4">{book.title}</td>
                    <td className="px-6 py-4">{book.author}</td>
                    <td className="px-6 py-4">{book.published_date || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {book.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button onClick={() => handleEdit(book)} className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-100 bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text" placeholder="Title" required
                  value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 outline-none"
                />
                <input
                  type="text" placeholder="Author" required
                  value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 outline-none"
                />
                <input
                  type="text" placeholder="Published Date (YYYY-MM-DD)"
                  value={formData.published_date} onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 outline-none"
                />
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.available} onChange={(e) => setFormData({ ...formData, available: e.target.checked })} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                  <label className="text-gray-700">Available</label>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); setEditingBook(null); setFormData({ title: '', author: '', published_date: '', available: true }); }} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">{editingBook ? 'Update' : 'Add'} Book</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
