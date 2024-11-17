const questions = [
    // Football Category Questions
    {
        category: 'Football',
        questionText: 'Which country won the FIFA World Cup in 2018?',
        answerOptions: [
            { answerText: 'Brazil', isCorrect: false },
            { answerText: 'Germany', isCorrect: false },
            { answerText: 'France', isCorrect: true },
            { answerText: 'Argentina', isCorrect: false },
        ],
    },
    {
        category: 'Football',
        questionText: 'Which player won the Ballon d\'Or in 2019?',
        answerOptions: [
            { answerText: 'Lionel Messi', isCorrect: true },
            { answerText: 'Cristiano Ronaldo', isCorrect: false },
            { answerText: 'Neymar', isCorrect: false },
            { answerText: 'Virgil van Dijk', isCorrect: false },
        ],
    },

    // Math Category Questions
    {
        category: 'Math',
        questionText: 'What is the square root of 144?',
        answerOptions: [
            { answerText: '12', isCorrect: true },
            { answerText: '14', isCorrect: false },
            { answerText: '16', isCorrect: false },
            { answerText: '18', isCorrect: false },
        ],
    },
    {
        category: 'Math',
        questionText: 'What is 15% of 200?',
        answerOptions: [
            { answerText: '30', isCorrect: true },
            { answerText: '25', isCorrect: false },
            { answerText: '20', isCorrect: false },
            { answerText: '35', isCorrect: false },
        ],
    },

    // TV Category Questions
    {
        category: 'TV',
        questionText: 'Who is the creator of "Breaking Bad"?',
        answerOptions: [
            { answerText: 'Vince Gilligan', isCorrect: true },
            { answerText: 'David Chase', isCorrect: false },
            { answerText: 'Matthew Weiner', isCorrect: false },
            { answerText: 'David Simon', isCorrect: false },
        ],
    },
    {
        category: 'TV',
        questionText: 'Which show is known for the phrase "Winter is Coming"?',
        answerOptions: [
            { answerText: 'Game of Thrones', isCorrect: true },
            { answerText: 'The Witcher', isCorrect: false },
            { answerText: 'Vikings', isCorrect: false },
            { answerText: 'The Last Kingdom', isCorrect: false },
        ],
    },

    // Films Category Questions
    {
        category: 'Films',
        questionText: 'Who directed "Inception"?',
        answerOptions: [
            { answerText: 'Christopher Nolan', isCorrect: true },
            { answerText: 'Steven Spielberg', isCorrect: false },
            { answerText: 'James Cameron', isCorrect: false },
            { answerText: 'Martin Scorsese', isCorrect: false },
        ],
    },
    {
        category: 'Films',
        questionText: 'Which movie won the Best Picture Oscar in 2020?',
        answerOptions: [
            { answerText: 'Parasite', isCorrect: true },
            { answerText: '1917', isCorrect: false },
            { answerText: 'Joker', isCorrect: false },
            { answerText: 'Once Upon a Time in Hollywood', isCorrect: false },
        ],
    },

    // News Category Questions
    {
        category: 'News',
        questionText: 'Who won the Nobel Peace Prize in 2020?',
        answerOptions: [
            { answerText: 'World Food Programme', isCorrect: true },
            { answerText: 'Greta Thunberg', isCorrect: false },
            { answerText: 'Donald Trump', isCorrect: false },
            { answerText: 'Malala Yousafzai', isCorrect: false },
        ],
    },
    {
        category: 'News',
        questionText: 'Which country left the European Union in 2020?',
        answerOptions: [
            { answerText: 'United Kingdom', isCorrect: true },
            { answerText: 'Germany', isCorrect: false },
            { answerText: 'France', isCorrect: false },
            { answerText: 'Greece', isCorrect: false },
        ],
    },
];

export default questions;
