const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLID,
  GraphQLFloat,
} = require("graphql");
const Quiz = require("../models/Quiz");
const User = require("../models/User");
const ClusteredQuestion = require("../models/ClusteredQuestions");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Question Type
const QuestionType = new GraphQLObjectType({
  name: "Question",
  fields: () => ({
    question: { type: GraphQLString },
    options: { type: new GraphQLList(GraphQLString) },
    correctAnswer: { type: GraphQLInt },
  }),
});

// Quiz Type
const QuizType = new GraphQLObjectType({
  name: "Quiz",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    questions: { type: new GraphQLList(QuestionType) },
  }),
});

// Clustered Quiz Type
const RecommendedQuizType = new GraphQLObjectType({
  name: "RecommendedQuiz",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    questions: { type: new GraphQLList(QuestionType) },
    cluster: { type: GraphQLInt },
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
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    score: { type: GraphQLInt },
  }),
});

// Submit Quiz Response Type
const SubmitQuizResponseType = new GraphQLObjectType({
  name: "SubmitQuizResponse",
  fields: {
    id: { type: GraphQLString },
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  },
});

const QuizResultType = new GraphQLObjectType({
  name: "QuizResult",
  fields: () => ({
    score: { type: GraphQLInt },
    answers: { type: new GraphQLList(GraphQLInt) },
    submittedAt: { type: GraphQLString },
    quiz: {
      type: QuizType,
      fields: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        questions: {
          type: new GraphQLList(QuestionType),
        },
      },
    },
  }),
});

const UserStatsType = new GraphQLObjectType({
  name: "UserStats",
  fields: {
    totalScore: { type: GraphQLInt },
    quizzesCompleted: { type: GraphQLInt },
    averageScore: { type: GraphQLFloat },
    lastQuizDate: { type: GraphQLString },
  },
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    quiz: {
      type: QuizType,
      args: {
        id: { type: GraphQLString },
        isRecommended: { type: GraphQLBoolean },
      },
      resolve(parent, args) {
        if (args.isRecommended) {
          return ClusteredQuestion.findById(args.id);
        }
        return Quiz.findById(args.id);
      },
    },
    quizzes: {
      type: new GraphQLList(QuizType),
      resolve() {
        return Quiz.find();
      },
    },
    recommendedQuiz: {
      type: RecommendedQuizType,
      args: { userId: { type: GraphQLID } },
      async resolve(_, { userId }) {
        try {
          const user = await User.findById(userId);
          if (!user || !user.recommendedCluster) {
            throw new Error("No recommended quiz available for this user.");
          }

          const clusteredQuiz = await ClusteredQuestion.findOne({
            cluster: user.recommendedCluster,
          });
          if (!clusteredQuiz) {
            throw new Error("No questions found for the recommended cluster.");
          }

          // Map "prompt" to "question" to match the GraphQL schema
          return clusteredQuiz;
        } catch (error) {
          console.error("Error fetching recommended quiz:", error.message);
          throw new Error(error.message);
        }
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
          const user = await User.findById(decoded.userId).select("-password");
          if (!user) throw new Error("User not found");
          return user;
        } catch (error) {
          throw new Error("Invalid or expired token");
        }
      },
    },
    getQuizResult: {
      type: QuizResultType,
      args: {
        submissionId: { type: GraphQLID },
        userId: { type: GraphQLID },
        isRecommended: { type: GraphQLBoolean },
      },
      async resolve(parent, { submissionId, userId, isRecommended }) {
        try {
          const user = await User.findById(userId);
          const userQuizResult = user.quizResults.find(
            (result) => result.id.toString() === submissionId
          );

          console.log("User quiz result:", userQuizResult);

          if (!userQuizResult) {
            throw new Error("Quiz result not found");
          }
          let quiz = null;
          quiz = await Quiz.findById(userQuizResult?.quizId);

          if (isRecommended) {
            quiz = await ClusteredQuestion.findById(userQuizResult?.quizId);
          }

          return {
            score: userQuizResult.score,
            answers: userQuizResult.answers,
            submittedAt: userQuizResult.submittedAt,
            quiz: quiz,
          };
        } catch (error) {
          throw new Error(`Error fetching quiz result: ${error.message}`);
        }
      },
    },
    getUserStats: {
      type: UserStatsType,
      args: {
        userId: { type: GraphQLID },
      },
      async resolve(parent, { userId }) {
        try {
          const user = await User.findById(userId);
          if (!user) throw new Error("User not found");

          const quizResults = user.quizResults || [];
          const totalScore = quizResults.reduce(
            (sum, result) => sum + result.score,
            0
          );
          const quizzesCompleted = quizResults.length;
          const averageScore =
            quizzesCompleted > 0 ? totalScore / quizzesCompleted : 0;

          const lastQuiz = quizResults[quizResults.length - 1];
          const lastQuizDate = lastQuiz ? lastQuiz.submittedAt : null;

          return {
            totalScore,
            quizzesCompleted,
            averageScore,
            lastQuizDate,
          };
        } catch (error) {
          throw new Error(`Error fetching user stats: ${error.message}`);
        }
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // User Registration
    register: {
      type: GraphQLString,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
      },
      async resolve(_, { username, email, password, firstName, lastName }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword);
        const user = new User({
          username,
          email,
          password: hashedPassword,
          firstName,
          lastName,
        });
        await user.save();
        return "User registered successfully";
      },
    },
    // User Login
    login: {
      type: new GraphQLObjectType({
        name: "LoginResponse",
        fields: {
          token: { type: GraphQLString },
          userId: { type: GraphQLString },
        },
      }),
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { email, password }) {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
          { userId: user._id, firstName: user.firstName },
          JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        return {
          token, // Return the JWT
          userId: user._id.toString(), // Return the userId as a string
        };
      },
    },
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
          throw new Error("Quiz not found");
        }
        return quiz;
      },
    },
    /*submitQuiz: {
      type: SubmitQuizResponseType,
      args: {
        userId: { type: GraphQLID },
        quizId: { type: GraphQLID },
        answers: { type: new GraphQLList(GraphQLInt) },
      },
      async resolve(parent, { userId, quizId, answers }) {
        try {
          const quiz = await Quiz.findById(quizId);
          const score = quiz.questions.reduce((total, q, i) => {
            const submittedAnswer = answers[i] + 1;
            return q.correctAnswer === submittedAnswer ? total + 1 : total;
          }, 0);

          const newQuizResult = {
            quizId,
            score,
            answers,
            submittedAt: new Date().toISOString(),
          };

          const user = await User.findById(userId);

          user.quizResults.push(newQuizResult);

          await user.save();

          const submissionId =
            user.quizResults[user.quizResults.length - 1]._id;

          console.log("Quiz submission saved:", {
            userId,
            quizId,
            score,
            submissionId,
            answersCount: answers.length,
          });

          return {
            id: submissionId, // Return the submission ID
            success: true,
            message: "Quiz submitted successfully",
          };
        } catch (error) {
          return {
            success: false,
            message: error.message,
          };
        }
      },
    },*/

    submitQuiz: {
      type: new GraphQLObjectType({
        name: "SubmitQuizResponseWithCluster",
        fields: {
          id: { type: GraphQLString },
          success: { type: GraphQLBoolean },
          message: { type: GraphQLString },
          cluster: { type: GraphQLInt },
          questions: {
            type: new GraphQLList(
              new GraphQLObjectType({
                name: "ClusterQuestion",
                fields: {
                  prompt: { type: GraphQLString },
                  options: { type: new GraphQLList(GraphQLString) },
                  correctAnswer: { type: GraphQLString },
                },
              })
            ),
          },
        },
      }),
      args: {
        userId: { type: GraphQLID },
        quizId: { type: GraphQLID },
        answers: { type: new GraphQLList(GraphQLInt) },
        isRecommended: { type: GraphQLBoolean },
      },
      async resolve(parent, { userId, quizId, answers, isRecommended }) {
        try {
          // Validate user
          let quiz = null;
          const user = await User.findById(userId);
          if (!user) throw new Error("User not found");

          // Fetch quiz and calculate score
          quiz = await Quiz.findById(quizId);

          if (isRecommended) {
            quiz = await ClusteredQuestion.findById(quizId);
          }

          console.log(quiz);

          if (!quiz) throw new Error("Quiz not found");

          const score = quiz.questions.reduce((total, q, i) => {
            console.log("submitted answer: ", answers[i]);
            console.log("submitted answer type: ", typeof answers[i]);
            console.log("actual answer: ", answers[i] + 1);
            console.log("actual answer type: ", typeof (answers[i] + 1));
            const submittedAnswer = answers[i] + 1;
            console.log(q.correctAnswer === submittedAnswer);
            console.log(typeof q.correctAnswer);
            return q.correctAnswer === submittedAnswer ? total + 1 : total;
          }, 0);

          // Call Swagger API to predict cluster
          const firstQuestion = quiz.questions[0];
          const axiosResponse = await axios.post(
            "http://localhost:8000/predict-cluster/",
            {
              prompt: firstQuestion.question,
              options: firstQuestion.options,
            }
          );
          const clusterId = axiosResponse.data.cluster;

          // Fetch questions for the cluster
          const clusterData = await ClusteredQuestion.findOne({
            cluster: clusterId,
          });
          const questions = clusterData
            ? clusterData.questions.slice(0, 5)
            : [];

          // Add quiz result to user
          const newQuizResult = {
            quizId,
            score,
            answers,
            cluster: clusterId,
            submittedAt: new Date().toISOString(),
          };

          user.quizResults.push(newQuizResult);
          user.recommendedCluster = clusterId;
          await user.save();

          // Safely retrieve the submission ID
          const savedResult = user.quizResults[user.quizResults.length - 1];
          if (!savedResult || !savedResult._id) {
            throw new Error("Failed to save quiz result.");
          }

          return {
            id: savedResult._id.toString(),
            success: true,
            message: "Quiz submitted successfully",
            cluster: clusterId,
            questions,
          };
        } catch (error) {
          console.error("Error in submitQuiz:", error.message);
          console.error("Error:", error);
          throw new Error(`Failed to submit quiz: ${error.message}`);
        }
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
          throw new Error("Quiz not found");
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
              const correctAnswerIndex = ["A", "B", "C", "D"].indexOf(
                item.correctAnswer
              );

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
              throw new Error("Quiz not found");
            }

            quiz.questions.push(...questions);
            return await quiz.save();
          } else {
            throw new Error("No questions returned from the API");
          }
        } catch (error) {
          console.error("Error fetching or saving questions:", error.message);
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
