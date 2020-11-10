//Saving HTML id's in variables for a clean code
let displayWord = document.getElementById('display-word');
let letters = document.getElementById('letters');
let statusDisplay = document.getElementById('status__display');
let svgMan = document.getElementById('svg__man');
let resetBtn = document.getElementById('reset__btn')
let statsBtn = document.getElementById('stats__btn')

//Id's for the SVG
let scaffold = document.getElementById('scaffold');
let head = document.getElementById('head');
let body = document.getElementById('body');
let arms = document.getElementById('arms');
let legs = document.getElementById('legs');

//Declaring some counters and arrays
let mistakesCounter = 0;
let maximumMistakes = 4;
let totalGuesses = 0;
let points = 0;
let totalWins = 0;
let totalLosses = 0;
let randomWord;
let wrongGuesses = [];
let rightGuesses = [];
let word = [];

//List of the different parts of the SVG hangman
let hangmanParts = [
  scaffold, head, body, arms, legs
];

//Letters in the alphabet
let alphabet = [
  'A', 'B', 'C', 'D', 'E', 'F',
  'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z', 'Å', 'Ä', 'Ö'
];

//Code for generating new buttons in the HTML-doc. For each of the letters in the alphabet
let generateButtons = () => {
  for (i = 0; i < alphabet.length; i++) {
    //Implement the respective HTML' elements in the inner HTML
    letters.innerHTML += `<a id="letter-${alphabet[i]}">${alphabet[i]}</a>`;
  }
};

generateButtons(); //Call the function above

//Array of words from which one will be randomly chosen
let wordList = [
  'Javascript',
  'HTML',
  'CSS',
  'Hangman',
  'Code',
  'Frontend'
];

//Function for generating a random word from the array above
let randomWordGenerator = () => {
  randomWord = wordList[Math.floor(Math.random() * wordList.length)];

  //The display shows a '__' for each letter in the randomized word
  for (i = 0; i < randomWord.length; i++) {
    word[i] = '__';
  }

  statusDisplay.innerHTML = 'Guess the word!'; //Type out on the status display
  displayWord.innerHTML = word.join(' '); //Type out the empty spaces and log the randomized word
  console.log(`The word is = ${randomWord}`); //Log the randomized word
};

randomWordGenerator(); //Call the function above

//Check for a click on the whole document
document.addEventListener('click', (e) => {
  let guess = e.target.innerHTML; //Save the clicked letter in a variable

  //Code below will run only if a letter was clicked
  if (guess.length == 1) {

    //For each of the letters of the randomized word
    for (i = 0; i < randomWord.length; i++) {

      //Check for the guessed letter
      if (guess.toUpperCase() === randomWord[i].toUpperCase()) {

        //If the letter wasn't already added to the list of right guesses
        if (rightGuesses.includes(guess) == false) {
          rightGuesses.push(guess); //Add the letter to the list of right guesses
          totalGuesses++; //Increase counter by 1
        }

        word[i] = guess; //Replace the corresponding blanks with the correctly guessed letter
        displayWord.innerHTML = word.join(' ') //Type out the right letters on the display
        e.target.innerHTML = ''; //Remove the clicked letter so it can't be chosen again
      }
    }

    //Check if the randomized word contains the guessed letter, if the guessed letter wasn't a right guess,
    //and hasn't already been added to the list of wrong guesses 
    if (randomWord.toUpperCase().includes(guess.toUpperCase()) == false && rightGuesses.includes(guess) == false && wrongGuesses.includes(guess) == false && mistakesCounter <= maximumMistakes) {
      wrongGuesses.push(guess); //Add the letter to the list of wrong guesses
      totalGuesses++; //Increase counter by 1
      mistakesCounter++; //Increase counter by 1
      statusDisplay.innerHTML = 'Mistakes: ' + mistakesCounter; //Type out on the status display
      e.target.innerHTML = ''; //Remove the clicked letter so it can't be chosen again
    }

    //Check if the word has any blank spaces, if not, the game is won
    if (word.includes('__') == false) {
      statusDisplay.innerHTML = 'You have Won! :)'; //Type out on the status display
      totalWins++; //Increase counter by 1
      points = points + 100 - mistakesCounter * 20; //Award 100 points if the word is guessed right, remove 20p per mistake

      //Clear all buttons
      for (i = 0; i < alphabet.length; i++) {
        letters.innerHTML = null;
      }
    }

    //Check if the max mistakes was reached, if so, the game is lost
    if (mistakesCounter > maximumMistakes) {
      statusDisplay.innerHTML = 'You have Lost :('; //Type out on the status display
      displayWord.innerHTML = randomWord; //Show the player what the word was
      totalLosses++; //Increase counter by 1

      //Clear all buttons
      for (i = 0; i < alphabet.length; i++) {
        letters.innerHTML = null;
      }
    }

    //Remove the 'hide' class from the SVG paths, part by part, each time a mistake is made
    for (i = 1; i <= hangmanParts.length; i++) {
      if (mistakesCounter == i) {
        hangmanParts[i - 1].classList -= 'hide';
      }
    }
  }
});

//Check for click on the 'Log Stats' button
statsBtn.addEventListener('click', () => {
  let minusPoints = mistakesCounter * 20; //Save the amount of points to subtract

  //Check if the game was finished, if so, log the game results
  if (word.includes('__') == false || mistakesCounter > maximumMistakes) {
    console.log(`* Points = ${points}p`);
    if (points > 0 || mistakesCounter > 0) {
      console.log(`* Mistakes = ${mistakesCounter}st (-${minusPoints}p/100)`);
    } else {
      console.log(`* Mistakes = ${mistakesCounter}st`);
    }
    console.log(`* Total guesses = ${totalGuesses}st`);
    console.log(`* Wrong guesses = ${wrongGuesses}`);
    console.log(`* Right guesses = ${rightGuesses}`);
    console.log(`* Total wins = ${totalWins}st`);
    console.log(`* Total losses = ${totalLosses}st`);
    console.log(''); //Log a blank line for easy reading
  }
});

//Check for a click on the 'New Round' button
resetBtn.addEventListener('click', () => {

  //Check if the game was finished, if so, reset the counters and arrays for the results of that round
  if (word.includes('__') == false || mistakesCounter > maximumMistakes) {
    mistakesCounter = 0;
    totalGuesses = 0;
    rightGuesses = [];
    wrongGuesses = [];
    word = [];
    randomWordGenerator(); //Insert the buttons again

    //Generate the buttons again
    for (i = 0; i < alphabet.length; i++) {
      generateButtons();
    }
  }

  //Hide the SVG again
  for (i = 0; i < hangmanParts.length; i++) {
    hangmanParts[i].classList = 'hide';
  }
});