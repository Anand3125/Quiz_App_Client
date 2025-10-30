import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../../../services/api';
import { 
  BookOpen, 
  Plus, 
  Users, 
  TrendingUp, 
  Clock, 
  Star,
  BarChart3,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import LoadingSpinner from '../../common/LoadingSpinner';

const TeacherDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0,
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [quizzesResponse] = await Promise.all([
        quizAPI.getTeacherQuizzes({ limit: 10 })
      ]);
      
      setQuizzes(quizzesResponse.data.quizzes || []);
      
      // Calculate analytics from quizzes
      const totalAttempts = quizzesResponse.data.quizzes.reduce((sum, quiz) => sum + (quiz.attempts || 0), 0);
      const averageScore = quizzesResponse.data.quizzes.length > 0 
        ? Math.round(quizzesResponse.data.quizzes.reduce((sum, quiz) => sum + (quiz.averageScore || 0), 0) / quizzesResponse.data.quizzes.length)
        : 0;
      
      setAnalytics({
        totalQuizzes: quizzesResponse.data.quizzes.length,
        totalAttempts,
        averageScore,
        totalStudents: Math.floor(totalAttempts * 0.7) // Estimate unique students
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizAPI.deleteQuiz(quizId);
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const handleTogglePublish = async (quizId, currentStatus) => {
    try {
      await quizAPI.togglePublish(quizId);
      setQuizzes(quizzes.map(quiz => 
        quiz._id === quizId 
          ? { ...quiz, isPublished: !currentStatus }
          : quiz
      ));
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Quizzes',
      value: analytics.totalQuizzes,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Total Attempts',
      value: analytics.totalAttempts,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Average Score',
      value: `${analytics.averageScore}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Active Students',
      value: analytics.totalStudents,
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your quizzes and track student performance</p>
        </div>
        <Link
          to="/dashboard/teacher/create"
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Quiz
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mr-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/teacher/create"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <Plus className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Create Quiz</h4>
              <p className="text-sm text-gray-600">Add a new quiz with questions</p>
            </div>
          </Link>
          
          <Link
            to="/dashboard/teacher/quizzes"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Manage Quizzes</h4>
              <p className="text-sm text-gray-600">Edit and organize your quizzes</p>
            </div>
          </Link>
          
          <Link
            to="/leaderboard"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">View Analytics</h4>
              <p className="text-sm text-gray-600">Check performance metrics</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Quizzes */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Quizzes</h3>
          <Link
            to="/dashboard/teacher/quizzes"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Quizzes Yet</h4>
            <p className="text-gray-600 mb-4">Create your first quiz to get started</p>
            <Link
              to="/dashboard/teacher/create"
              className="btn btn-primary"
            >
              Create Quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{quiz.subject}</span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {quiz.duration} min
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {quiz.attempts} attempts
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    quiz.isPublished 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-gray-600 bg-gray-100'
                  }`}>
                    {quiz.isPublished ? 'Published' : 'Draft'}
                  </span>
                  
                  <Link
                    to={`/dashboard/teacher/analytics/${quiz._id}`}
                    className="p-2 text-gray-400 hover:text-primary-600"
                    title="View Analytics"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Link>
                  
                  <Link
                    to={`/quiz/${quiz._id}`}
                    className="p-2 text-gray-400 hover:text-green-600"
                    title="Preview Quiz"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  
                  <button
                    onClick={() => handleTogglePublish(quiz._id, quiz.isPublished)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title={quiz.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {quiz.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteQuiz(quiz._id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Delete Quiz"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
