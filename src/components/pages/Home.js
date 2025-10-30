import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Users, Award, Clock, ArrowRight, Play } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Quizzes',
      description: 'Engage with comprehensive quizzes across various subjects and difficulty levels.',
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: 'Timed Assessments',
      description: 'Test your knowledge under time pressure with realistic exam conditions.',
      color: 'text-green-600'
    },
    {
      icon: Award,
      title: 'Performance Tracking',
      description: 'Monitor your progress with detailed analytics and performance insights.',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Leaderboards',
      description: 'Compete with peers and see how you rank among other students.',
      color: 'text-orange-600'
    }
  ];

  const stats = [
    { label: 'Active Quizzes', value: '500+' },
    { label: 'Students', value: '10K+' },
    { label: 'Teachers', value: '500+' },
    { label: 'Questions', value: '50K+' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master Your Knowledge with
            <span className="block text-yellow-300">Interactive Quizzes</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Join thousands of students and teachers in our comprehensive quiz platform.
            Practice, compete, and excel in your learning journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/quizzes"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Quizzing
                </Link>
                {user?.role === 'teacher' && (
                  <Link
                    to="/dashboard/teacher"
                    className="btn bg-primary-500 text-white hover:bg-primary-400 px-8 py-3 text-lg"
                  >
                    Teacher Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="btn bg-primary-500 text-white hover:bg-primary-400 px-8 py-3 text-lg"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white rounded-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to create, take, and manage quizzes effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-hover text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center ${feature.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-2xl">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of learners and educators today. Create an account and start your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-primary px-8 py-3 text-lg"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/quizzes"
                className="btn btn-secondary px-8 py-3 text-lg"
              >
                Browse Quizzes
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
