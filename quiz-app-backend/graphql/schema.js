const axios = require('axios'); // Add this at the top of schema.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Question Type
const QuestionType = new GraphQLObjectType({
  name: 'Question',
  fields: () => ({
    question: { type: GraphQLString },
    options: { type: new GraphQLList(GraphQLString) },
    correctAnswer: { type: GraphQLInt },
  }),
});

// Quiz Type
const QuizType = new GraphQLObjectType({
  name: 'Quiz',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    questions: { type: new GraphQLList(QuestionType) },
  }),
});

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    score: { type: GraphQLInt },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    quiz: {
      type: QuizType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Quiz.findById(args.id);
      },
    },
    quizzes: {
      type: new GraphQLList(QuizType),
      resolve() {
        return Quiz.find();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    profile: {
      type: UserType,
      args: {
        token: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { token }) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          const user = await User.findById(decoded.userId).select('-password');
          if (!user) throw new Error('User not found');
          return user;
        } catch (error) {
          throw new Error('Invalid or expired token');
        }
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // User Registration
    register: {
      type: GraphQLString,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { username, email, password }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword); 
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        return 'User registered successfully';
      },
    },
    // User Login
    login: {
      type: GraphQLString,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { email, password }) {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('User not found');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        return token; // Return the JWT
      },
    },
    addQuiz: {
      type: QuizType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        const quiz = new Quiz({
          title: args.title,
          description: args.description,
        });
        return quiz.save();
      },
    },
    addQuestion: {
      type: QuizType,
      args: {
        quizId: { type: new GraphQLNonNull(GraphQLString) },
        question: { type: new GraphQLNonNull(GraphQLString) },
        options: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        correctAnswer: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args) {
        const quiz = await Quiz.findById(args.quizId);
        if (!quiz) {
          throw new Error('Quiz not found');
        }
        quiz.questions.push({
          question: args.question,
          options: args.options,
          correctAnswer: args.correctAnswer,
        });
        return quiz.save();
      },
    },
    addQuestionsFromAPI: {
      type: QuizType,
      args: {
        quizId: { type: new GraphQLNonNull(GraphQLString) },
        amount: { type: GraphQLInt, defaultValue: 10 }, // Default to 10 questions
      },
      async resolve(parent, args) {
        const { quizId, amount } = args;
        const apiUrl = `http://localhost:3001/questions?amount=${amount}`;

        try {
          const response = await axios.get(apiUrl);

          if (response.data && response.data.length > 0) {
            const questions = response.data.map((item) => {
              const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(item.correctAnswer);

              if (correctAnswerIndex === -1) {
                throw new Error(
                  `Correct answer "${item.correctAnswer}" not found in expected options (A, B, C, D).`
                );
              }

              return {
                question: item.question,
                options: item.options,
                correctAnswer: correctAnswerIndex + 1, // Convert to 1-based index
              };
            });

            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
              throw new Error('Quiz not found');
            }

            quiz.questions.push(...questions);
            return await quiz.save();
          } else {
            throw new Error('No questions returned from the API');
          }
        } catch (error) {
          console.error('Error fetching or saving questions:', error.message);
          throw new Error(error.message);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
