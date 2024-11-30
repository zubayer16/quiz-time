const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLInputObjectType,} = require('graphql');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

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

const QuestionInputType = new GraphQLInputObjectType({
  name: "QuestionInput",
  fields: {
    question: { type: GraphQLString },
    options: { type: new GraphQLList(GraphQLString) },
    correctAnswer: { type: GraphQLInt }, // Adjust type to match your needs
  },
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
      resolve(parent, args) {
        return Quiz.find({});
      },
    },
    recommendedQuizzes: {
      type: new GraphQLList(QuizType),
      args: { userId: { type: GraphQLString } },
      resolve(parent, args) {
        // Implement your recommendation logic here
        // For example, find quizzes based on user's past performance or interests
        return Quiz.find({ /* criteria based on user data */ });
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addQuiz: {
      type: QuizType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        questions: { type: new GraphQLList(QuestionInputType) },
      },
      resolve(parent, args) {
        const quiz = new Quiz({
          title: args.title,
          description: args.description,
          questions: args.questions,
        });
        return quiz.save();
      },
    },
    updateQuiz: {
      type: QuizType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        questions: { type: new GraphQLList(QuestionInputType) }, // Use input type here
      },
      resolve(parent, args) {
        return Quiz.findByIdAndUpdate(
          args.id,
          {
            title: args.title,
            description: args.description,
            questions: args.questions,
          },
          { new: true }
        );
      },
    }, 
    deleteQuiz: {
      type: QuizType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const quiz = await Quiz.findByIdAndDelete(args.id);
        if (!quiz) {
          throw new Error('Quiz not found');
        }
        return quiz;
      },
    },
    submitQuiz: {
      type: GraphQLInt, // Return the score as an integer
      args: {
        quizId: { type: new GraphQLNonNull(GraphQLString) },
        answers: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) }, // List of answers
      },
      async resolve(parent, args) {
        const quiz = await Quiz.findById(args.quizId);
        if (!quiz) {
          throw new Error('Quiz not found');
        }

        let score = 0;
        quiz.questions.forEach((question, index) => {
          if (question.correctAnswer === args.answers[index]) {
            score += 1; // Increment score for each correct answer
          }
        });

        return score;
      },
    },
    addUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        const user = new User({
          username: args.username,
          email: args.email,
        });
        return user.save();
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
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
