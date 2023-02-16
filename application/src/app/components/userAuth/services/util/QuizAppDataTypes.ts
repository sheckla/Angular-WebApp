export class User {
  public name: string = '';
  public isLoggedIn: boolean = false;
  public isInsideLobby: boolean = false;
}

export class LobbyInfo {
  public name: string = '';
  public leader: string = '';
  public users: string[] = []; // All current Users in Lobby (joined + leader)
  public category: string = 'Any'; // Default should be Any
  public totalQuestions: number = 10; // Default should be '10'
  public difficulty: string = 'Normal'; // Default should be normal
  public started: boolean = false;
}

// Same interface as requested from opentdb
export class QuizQuestion {
  public category: string = '';
  public type: string = '';
  public difficulty: string = '';
  public question: string = '';
  public correctAnswer: string = '';
  public falseAnswers: string[] = [];
}

// First Idea of Quiz
export class Quiz {
  public questions: QuizQuestion[] = [];
  public total: number = 0; // Will count up each question
  public correct: number = 0;
  public wrong: number = 0;
  public timer: number = 30; // Timer in Seconds, must be replaced
  // TODO: Timer replacen
}

//Real Questions from opentdb
/*
<!-- [
    {
      "category": "Entertainment: Cartoon & Animations",
      "type": "multiple",
        "difficulty": "easy",
        "question": "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
        "correctAnswer": "Scar",
        "falseAnswers": [
            "Fred",
            "Jafar",
            "Vada"
        ]
    },
    {
        "category": "Entertainment: Film",
        "type": "multiple",
        "difficulty": "medium",
        "question": "Which retired American football quarterback played himself in &#039;Ace Ventura: Pet Detective&#039; and &#039;Little Nicky&#039;?",
        "correctAnswer": "Dan Marino",
        "falseAnswers": [
            "John Elway",
            "Tom Brady",
            "Joe Montana"
        ]
    },
    {
        "category": "Geography",
        "type": "multiple",
        "difficulty": "medium",
        "question": "Montreal is in which Canadian province?",
        "correctAnswer": "Quebec",
        "falseAnswers": [
            "Ontario",
            "Nova Scotia",
            "Alberta"
        ]
    },
    {
        "category": "Geography",
        "type": "multiple",
        "difficulty": "medium",
        "question": "What is the largest non-continental island in the world?",
        "correctAnswer": "Greenland",
        "falseAnswers": [
            "New Guinea",
            "Borneo",
            "Madagascar"
        ]
    },
    {
        "category": "Geography",
        "type": "multiple",
        "difficulty": "easy",
        "question": "What is the capital of Scotland?",
        "correctAnswer": "Edinburgh",
        "falseAnswers": [
            "Glasgow",
            "Dundee",
            "London"
        ]
    },
    {
        "category": "History",
        "type": "multiple",
        "difficulty": "easy",
        "question": "In 1453, which important city fell?",
        "correctAnswer": "Constantinople",
        "falseAnswers": [
            "Rome",
            "Hamburg",
            "Athens"
        ]
    },
    {
        "category": "Entertainment: Video Games",
        "type": "boolean",
        "difficulty": "medium",
        "question": "Shang Tsung is a playable character in Mortal Kombat XL.",
        "correctAnswer": "False",
        "falseAnswers": [
            "True"
        ]
    },
    {
        "category": "Science & Nature",
        "type": "boolean",
        "difficulty": "medium",
        "question": "&quot;Tachycardia&quot; or &quot;Tachyarrhythmia&quot; refers to a resting heart-rate near or over 100 BPM.",
        "correctAnswer": "True",
        "falseAnswers": [
            "False"
        ]
    },
    {
        "category": "Geography",
        "type": "multiple",
        "difficulty": "hard",
        "question": "Which is not a country in Africa?",
        "correctAnswer": "Guyana",
        "falseAnswers": [
            "Senegal",
            "Liberia",
            "Somalia"
        ]
    },
    {
        "category": "Entertainment: Music",
        "type": "multiple",
        "difficulty": "easy",
        "question": "Who is the lead singer of Foo Fighters?",
        "correctAnswer": "Dave Grohl",
        "falseAnswers": [
            "Dave Mustaine",
            "James Hetfield",
            "Little Red Riding Hood"
        ]
    }
] -->

*/
