import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { quizAPI } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { 
  BookOpen, 
  Clock, 
  DollarSign, 
  Tag, 
  FileText,
  Plus,
  Trash2,
  Save
} from 'lucide-react';

// Validation schema
const quizSchema = yup.object({
  title: yup.string().required('Quiz title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required'),
  subject: yup.string().required('Subject is required'),
  category: yup.string().required('Category is required'),
  difficulty: yup.string().required('Difficulty is required'),
  duration: yup.number().required('Duration is required').min(1, 'Duration must be at least 1 minute'),
  passingMarks: yup.number().min(0, 'Passing marks cannot be negative').max(100, 'Passing marks cannot exceed 100'),
  isPaid: yup.boolean(),
  price: yup.number().when('isPaid', {
    is: true,
    then: yup.number().required('Price is required for paid quizzes').min(1, 'Price must be at least 1'),
    otherwise: yup.number().min(0)
  })
});

const CreateQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(quizSchema),
    defaultValues: {
      isPaid: false,
      passingMarks: 50,
      price: 0
    }
  });

  const isPaid = watch('isPaid');

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'medium',
      marks: 1,
      timeLimit: 60
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.map((opt, idx) => 
              idx === optionIndex ? value : opt
            )
          }
        : q
    ));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const onSubmit = async (data) => {
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1}: Question text is required`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`Question ${i + 1}: All options must be filled`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      // Create quiz
      const quizResponse = await quizAPI.createQuiz(data);
      const quizId = quizResponse.data.quiz._id;

      // Prepare questions data
      const questionsData = questions.map(q => ({
        quizId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        marks: q.marks,
        timeLimit: q.timeLimit
      }));

      // Create questions
      await quizAPI.bulkCreateQuestions({ quizId, questions: questionsData });

      toast.success('Quiz created successfully!');
      navigate('/dashboard/teacher');
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
          <p className="text-gray-600 mt-2">Design and configure your quiz</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/teacher')}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Quiz Basic Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="input"
                placeholder="Enter quiz title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input"
                placeholder="Describe what this quiz covers"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select {...register('subject')} className="input">
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-error-600">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select {...register('category')} className="input">
                <option value="">Select Category</option>
                <option value="academic">Academic</option>
                <option value="competitive">Competitive</option>
                <option value="technical">Technical</option>
                <option value="general">General</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select {...register('difficulty')} className="input">
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-error-600">{errors.difficulty.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                {...register('duration', { valueAsNumber: true })}
                type="number"
                min="1"
                className="input"
                placeholder="e.g., 30"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-error-600">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passing Marks (%)
              </label>
              <input
                {...register('passingMarks', { valueAsNumber: true })}
                type="number"
                min="0"
                max="100"
                className="input"
                placeholder="e.g., 50"
              />
              {errors.passingMarks && (
                <p className="mt-1 text-sm text-error-600">{errors.passingMarks.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                min="0"
                className="input"
                placeholder="0 for free quiz"
                disabled={!isPaid}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-error-600">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                {...register('isPaid')}
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">This is a paid quiz</span>
            </label>
          </div>
        </div>

        {/* Questions Section */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Questions ({questions.length})
            </h3>
            <button
              type="button"
              onClick={addQuestion}
              className="btn btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Questions Added</h4>
              <p className="text-gray-600 mb-4">Add questions to make your quiz interactive</p>
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-primary"
              >
                Add First Question
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text *
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                        rows={2}
                        className="input"
                        placeholder="Enter your question here..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty
                        </label>
                        <select
                          value={question.difficulty}
                          onChange={(e) => updateQuestion(question.id, 'difficulty', e.target.value)}
                          className="input"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marks
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={question.marks}
                          onChange={(e) => updateQuestion(question.id, 'marks', parseInt(e.target.value))}
                          className="input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options *
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                              className="mr-3"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              className="input flex-1"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation (Optional)
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                        rows={2}
                        className="input"
                        placeholder="Explain why this is the correct answer..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/teacher')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || questions.length === 0}
            className="btn btn-primary flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Creating Quiz...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
