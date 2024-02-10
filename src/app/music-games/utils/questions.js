import data from '../data/data.json';
const gameIdx = { note: 0, key: 1, 'major-minor': 2, scale: 3 };
const levelIdx = { easy: 0, medium: 1, hard: 2 };

function getRandomQuestions(questions, number, game) {
  let ques = [];
  let listOfQuestions = [...questions];
  if (game == 'key') {
    for (let i = number; i > 0; i--) {
      let randomNumber = Math.floor(Math.random() * questions.length);
      ques.push(questions[randomNumber]);
    }
    return ques;
  } else {
    for (let i = number; i > 0; i--) {
      let questionIndex = Math.floor(Math.random() * listOfQuestions.length);
      let question = listOfQuestions[questionIndex];
      ques.push({ ...question }); // Create a copy of the question object
      listOfQuestions.splice(questionIndex, 1); // Remove the selected question
    }
    // console.log('questions: ', ques);
    return ques;
  }
}

export function getQuestions(game, level) {
  const gameData = data.musicGames[gameIdx[game]].levels;
  const numOfQuestionsPerLevel = gameData[levelIdx[level]].numberOfQuestions;
  const questions = [];

  for (const [level, numQuestions] of Object.entries(numOfQuestionsPerLevel)) {
    questions.push(
      ...getRandomQuestions(
        gameData[levelIdx[level]].questions,
        numQuestions,
        game
      )
    );
  }

  return questions;
}
