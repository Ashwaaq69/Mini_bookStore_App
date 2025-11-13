import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, Shield, ArrowRight } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="text-primary-600">BookStore</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover your next favorite book in our curated collection. 
              From timeless classics to modern masterpieces, we have something for every reader.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/books"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
              >
                Browse Books
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-primary-600 bg-white hover:bg-gray-50 rounded-lg border border-primary-600 transition-colors duration-200"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Curated Collection
              </h3>
              <p className="text-gray-600">
                Carefully selected books across all genres to ensure quality and diversity.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Join a community of book lovers and share your reading experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Platform
              </h3>
              <p className="text-gray-600">
                Your data and privacy are protected with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;