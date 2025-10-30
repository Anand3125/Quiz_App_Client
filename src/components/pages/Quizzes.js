import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import { BookOpen, Clock, Users, Star, Lock, Play, Filter } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    difficulty: '',
    category: ''
  });

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getAllQuizzes(filters);
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'academic': return BookOpen;
      case 'competitive': return Star;
      case 'technical': return Users;
      default: return BookOpen;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
          <p className="text-gray-600 mt-2">Choose from our collection of interactive quizzes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="input"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="input"
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="academic">Academic</option>
              <option value="competitive">Competitive</option>
              <option value="technical">Technical</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quizzes Found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later for new quizzes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const CategoryIcon = getCategoryIcon(quiz.category);
            return (
              <div key={quiz._id} className="card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <CategoryIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600">{quiz.subject}</p>
                    </div>
                  </div>
                  {quiz.isPaid && (
                    <div className="flex items-center text-yellow-600">
                      <Lock className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Premium</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {quiz.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {quiz.duration} min
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {quiz.totalQuestions} questions
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {quiz.attempts} attempts
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 mr-1" />
                    {quiz.averageScore || 0}% avg
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/quiz/${quiz._id}`}
                    className="btn btn-primary flex-1 flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Quiz
                  </Link>
                  <Link
                    to={`/leaderboard/${quiz._id}`}
                    className="btn btn-secondary px-3"
                  >
                    <Users className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
