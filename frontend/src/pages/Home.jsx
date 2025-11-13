import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, Shield, ArrowRight } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-screen flex items-center justify-center"
        style={{
          
          backgroundImage:
            "url('https://imgs.search.brave.com/OkST8WcJ46sDLnARS3CLyIkJBtCjFXdu53cqmrwhYz4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zb2Np/YWxwcmludHN0dWRp/by5jb20vY2RuL3No/b3AvZmlsZXMvdGlu/eS1ib29rc2hlbGYt/MS5qcGc_dj0xNzYy/Mjk4NTA3JndpZHRo/PTE0NDU')",
        }}
        
      >
        <div className="absolute inset-0 "></div>
        <div className="relative text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-yellow-400">BookStore</span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto">
            Discover your next favorite book in our curated collection. From timeless classics
            to modern masterpieces, we have something for every reader.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/books"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-yellow-400 hover:bg-yellow-500 rounded-lg shadow-lg transition duration-300"
            >
              Browse Books <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-yellow-400 bg-white hover:bg-gray-100 rounded-lg shadow-lg border border-yellow-400 transition duration-300"
              >
                Join Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer a unique experience for every reader with quality books and a vibrant community.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition duration-300">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Collection</h3>
            <p className="text-gray-600">
              Carefully selected books across all genres to ensure quality and diversity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition duration-300">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
            <p className="text-gray-600">
              Join a community of book lovers and share your reading experiences.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition duration-300">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Platform</h3>
            <p className="text-gray-600">
              Your data and privacy are protected with enterprise-grade security.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
