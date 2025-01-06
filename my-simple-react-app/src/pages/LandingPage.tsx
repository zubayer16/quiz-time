import React from 'react';
import { BookOpen, Brain, Trophy, Users, ArrowRight, Check } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Brain className='h-8 w-8 text-blue-500' />,
      title: 'Smart Learning',
      description: 'Adaptive quizzes that match your skill level and learning pace',
    },
    {
      icon: <Trophy className='h-8 w-8 text-blue-500' />,
      title: 'Track Progress',
      description: 'Detailed analytics and insights to monitor your improvement',
    },
    {
      icon: <Users className='h-8 w-8 text-blue-500' />,
      title: 'Community',
      description: 'Compete with friends and learn together in study groups',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student',
      content:
        'Quiz Time has transformed how I prepare for my exams. The variety of questions and instant feedback is incredible!',
    },
    {
      name: 'Mike Chen',
      role: 'Teacher',
      content:
        "As an educator, I love how I can track my students' progress and identify areas where they need more support.",
    },
  ];

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className='min-h-screen'>
      {/* Navigation */}
      <nav className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16 items-center'>
            <div className='flex items-center'>
              <BookOpen className='h-8 w-8 text-blue-600' />
              <span className='ml-2 text-2xl font-bold'>Quiz Time</span>
            </div>
            <div className='flex items-center space-x-4'>
              <button
                className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
                onClick={() => handleSignIn()}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-50 to-indigo-50 py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-5xl font-bold text-gray-900 mb-6'>Learn Smarter, Not Harder</h1>
            <p className='text-xl text-gray-600 mb-2 max-w-2xl mx-auto'>
              Join millions of students using Quiz Time to ace their exams and master new subjects
              through interactive quizzes.
            </p>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
              Test your knowledge across a wide range of interesting topics and challenge your
              friends!
            </p>
            <button
              className='bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 inline-flex items-center'
              onClick={() => navigate('/register')}
            >
              Get Started Free <ArrowRight className='ml-2 h-5 w-5' />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Why Choose Quiz Time?</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Our platform is designed to make learning engaging, effective, and enjoyable.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <Card key={index} className='text-center'>
                <CardContent className='p-6'>
                  <div className='mx-auto w-12 h-12 flex items-center justify-center mb-4'>
                    {feature.icon}
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                  <p className='text-gray-600'>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='bg-gray-50 py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>What Our Users Say</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className='p-6'>
                  <p className='text-gray-600 mb-4'>"{testimonial.content}"</p>
                  <div>
                    <p className='font-semibold'>{testimonial.name}</p>
                    <p className='text-gray-500'>{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-blue-600 text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-4'>Start Your Learning Journey Today</h2>
          <p className='mb-8 text-blue-100 max-w-2xl mx-auto'>
            Join thousands of students who are already improving their knowledge with Quiz Time.
          </p>
          <button
            className='bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100'
            onClick={() => navigate('/register')}
          >
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-gray-400 py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div>
              <h4 className='text-white font-semibold mb-4'>Product</h4>
              <ul className='space-y-2'>
                <li>Features</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className='text-white font-semibold mb-4'>Resources</h4>
              <ul className='space-y-2'>
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
